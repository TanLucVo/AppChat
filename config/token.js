const jwt = require('jsonwebtoken')
function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    try {
        return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3000s' });
    } catch (error) {
        console.log(error)
    }
     
}
function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.cookies.token
    
    const token = authHeader
    if (token == null) return res.sendStatus(401) // if there isn't any token
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) => {
      if (err) return res.redirect('/auth/logout')
      next() // pass the execution off to whatever request the client intended
    })
}
module.exports = { generateAccessToken, authenticateToken }