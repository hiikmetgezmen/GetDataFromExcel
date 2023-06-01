const { check, validationResult } = require("express-validator");

const checkAuth = require("../middleware/checkAuth");
const { users } = require("../db");
const router = require("express").Router();const  JWT  = require("jsonwebtoken");

let refreshTokens = [];
router.post("/signup",[check("email","Please valid an email").isEmail(),check("password","Min 6 characters").isLength({
    min:6
})],(req,res)=>{
    const {username,email,password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }

    let user = users.find((user)=>{
        return user.username == username
    })

    if(user) 
    {
        res.status(400).json({
            errors:[{
                "msg":"User is already exists"
            }]
        })
    }


    users.push({
        username,
        password
    })

})


router.get("/getall",checkAuth,(req,res)=>{
    res.json(users);
})

router.post("/logout", checkAuth, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("You logged out successfully.");
  });

const generateAccessToken = (user) => {
    return JWT.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
      expiresIn: "5s",
    });
  };
  
  const generateRefreshToken = (user) => {
    return JWT.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
  };

router.post("/refresh", (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid!");
    }
    JWT.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
      err && console.log(err);
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
  
      refreshTokens.push(newRefreshToken);
  
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  });

router.post("/login",(req,res)=>{
    const {username,password} = req.body;

    const user = users.find((user)=>{
        return user.username === username && user.password === password;
    });

    if(user) 
    {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.json({
            username:user.username,
            isAdmin:user.isAdmin,
            accessToken,
            refreshToken
        });
    }
    else{
        res.status(400).json("Username or password incorrect")
    }


})
module.exports = router;