const ApiError = require('../utils/apiError')

const handleDevErrors = (err, res) => {
    res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack})
    console.log('dev errors')

}

const handleProdErrors = (err, res) => {
    res.status(err.statusCode).json({ status: err.status, message: err.message })
}

const handleGlobalErrors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if(process.env.NODE_ENV === "development"){
        handleDevErrors(err, res)
    } else {
        handleProdErrors(err, res)    
    }
}

module.exports = handleGlobalErrors