const crypto = require("node:crypto")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const ApiError = require("../utils/apiError")
const sendEmail = require("../utils/emailSender")
const { tokenCookies, refreshAccessToken } = require("../utils/generateSecureToken")

exports.signup = async (req, res, next) => {

    const existingUser = await User.findOne({ email: req.body.email})

    if(existingUser){
        return next(new ApiError("user already exist", 400))
    }
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    

    tokenCookies(user, 201, res)
    console.log({tokenCookies})
}

exports.login = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    const password = await bcrypt.compare(req.body.password, user.password)

    if(!user || !password){
        return next(new ApiError("Incorrect email or password", 401))
    } 

    tokenCookies(user, 200, res)
    console.log({tokenCookies})
}

exports.protectRoutes = async (req, res, next) => {
    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        return next(new ApiError("Please login to access this route", 401))
    }

   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

   const currentUser = await User.findById(decoded.userId)

   if(!currentUser){
    return next(new ApiError('user does not exist', 401))
   }

   let passwordChangedAtTimestamp
   if(currentUser.passwordChangedAt){
    passwordChangedAtTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10)
   }

   if(passwordChangedAtTimestamp > decoded.iat){
    return next(new ApiError("You recently changed your password, please login again", 401))
   }

   req.user = currentUser

   next()
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user){
        return next(new ApiError("user does not exist", 404))
    }

    const resetCode = Math.floor(Math.random() * 900000).toString()
    const hashedResetCode = crypto.createHash('shake256').update(resetCode).digest('hex')

    user.passwordResetCode = hashedResetCode
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    user.passwordResetVerified = false

    await user.save()
    const message = `Hi ${user.name},\n We received the request. \n Your rest code is ${resetCode} \n Enter this code to complete the reset.`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset code is valid for 10 minutes",
            message: message
        })
    } catch (error) {
        user.passwordResetCode = undefined
        user.passwordResetExpires = undefined
        user.passwordResetVerified = undefined
        await user.save()


        return next(new ApiError(`There is an error in sending email`), 500)        
    }

    res.status(200).json({
        status: "success",
        message: "Reset code sent to email"
    })
}