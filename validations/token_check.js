require('dotenv').config();
const { verify } = require("jsonwebtoken");

module.exports = {

    /**
     * Middleware function to check if the user is logged in or not
     * 
     * Checks for a valid jwt token
    */
    checkToken : (req,res,next)=>{
        let token = req.get("authorization");
        if(token){
            token = token.slice(7);
            verify(token,process.env.JWT_KEY,(err,decoded)=>{
                if(err){
                    res.json({
                        success : 0,
                        message :"Unauthorized User"
                    });
                }
                req.user = decoded.result;
                next();
            });
        }
        else{
            res.json({
                success : 0,
                message :"Unauthorized User"
            });
        }
    }
}