const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    console.log("verify jwt");
    const authHeader = req.headers.authorization || req.headers.Authorization;

    console.log("authHeader" , authHeader)
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'access not exist in header', status: 'error' });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'access token expired', status: 'forbidden' }); //invalid token
          console.log("decode" , decoded)
          
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT