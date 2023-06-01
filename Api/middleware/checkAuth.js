const JWT = require("jsonwebtoken");

module.exports = async (req,res,next) => {
    const authHeader = req.header.authorization;
    if(authHeader)
    {
        const token = authHeader.split('')[1];
        JWT.verify(token,"zxcvbnjbn",(err,user)=>{
            if(err)
            {
                res.status(403).json("Token is not valid");
            }
            req.user = user;
            next();
        });

    }
    else{
        res.status(401).json("You are not authenticated");
    }
}