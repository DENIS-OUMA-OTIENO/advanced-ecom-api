const jwt = require("jsonwebtoken")

const accessToken = (userId) => {
   return jwt.sign({ userId }, 
        process.env.ACCESS_TOKEN,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

const refreshToken = (userId) => {
    return jwt.sign({ userId },
    process.env.REFRESH_TOKEN, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

const tokenCookies = (user, statusCode, res) => {
    const createAccessToken = accessToken(user._id)
    const createRefreshToken = refreshToken(user._id)


    const cookieOptions = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === "production") cookieOptions.secure = true

    res.cookie("jwt", createAccessToken, cookieOptions)

    res.cookie("refresh_token", createRefreshToken, cookieOptions)

    res.status(statusCode).json({ status: "success", createAccessToken, createRefreshToken})



}
const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;
  
    // If there's no refresh token, respond with an error
    if (!refreshToken) {
      return res.status(401).json({
        status: 'fail',
        message: 'No refresh token found, please login again.',
      });
    }
  
    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 'fail',
          message: 'Invalid or expired refresh token.',
        });
      }
  
      // If the refresh token is valid, create a new access token
      const newAccessToken = createAccessToken(decoded.userId);
  
      // Send the new access token as a response (can also send a new refresh token if you choose to rotate them)
      res.status(200).json({
        status: 'success',
        accessToken: newAccessToken,
      });
    });
  };
  
  module.exports = { tokenCookies, refreshAccessToken };