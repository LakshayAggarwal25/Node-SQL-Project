require('dotenv').config();

const { genSalt,hash,compare } = require('bcrypt');
const {sign} = require("jsonwebtoken");
const { create, getUserByNumber,getUserForLogin,getUserByName, userExistInGB, reportNewUser, reportOldUser,alreadyReported} = require("../models/users");

module.exports = {
    /**
    * 
    *  Controller for creating a new user.
    *  
    *  Password is encrypted using bcrypt, then data is sent to the model for creating the user in database
    */
    createUser : async(req,res)=>{
        const body = req.body;
        const SALT = await genSalt(10);
        body.password = await hash(body.password,SALT);

        create(body,(err,result)=>{
            if(err){
                return res.status(500).json({
                    success : 0 ,
                    message : `error`
                }); 
            }

            // User is created successfully
            return res.status(200).json({
                success : 1 ,
                data : result
            })
        })
    },

    /**
     * Controller for searching a user
     * 
     * If number is passed as true by the client then the searching in done on the basis of number. 
     * Else searching is done on the basis of name
     */
    getUserByNumber : (req, res)=>{
        if(req.body.number === true){
            const number = req.params.number;
            getUserByNumber(number,(err,result)=>{
                if(err || result.length == 0){
                    return res.status(404).json({
                        success : 0 ,
                        message : `User not found`
                    }); 
                }
                return res.status(200).json({
                    success : 1 ,
                    data : result
                })
            })
        }
        else{
            const name = req.params.number;
            getUserByName(name,(err,result)=>{
                if(err || result.length == 0){
                    return res.status(404).json({
                        success : 0 ,
                        message : `User not found`
                    }); 
                }
                return res.status(200).json({
                    success : 1 ,
                    data : result
                })
            })
        }
        
    },
    
    /**
     * Controller to report a number as spam in this number
    */
    reportUser : (req,res)=>{
        const reportNumber = req.body.phoneNumber;
        userExistInGB(reportNumber,(err,result)=>{
            if(err){
                return res.status(500).json({
                    success : 0 ,
                    message : `Internal Error`
                }); 
            }
            else{
                
                alreadyReported(reportNumber,req.user,(err,result)=>{
                    if(err) {
                        return res.status(500).json({
                            success : 0 ,
                            message : `Internal Error`
                        }); 
                    }
                    
                    // Returning response if the number has already been reported by this user
                    if(result === true){
                        return res.status(200).json({
                            success : 0 ,
                            message : `Already Reported`
                        }); 
                    }

                    //If the user does not exist in the database and has not been reported this user then creating a new spam number.
                    if (result.length == 0) {
                        reportNewUser(reportNumber, (err, result) => {
                            if (err) {
                                return res.status(500).json({
                                    success: 0,
                                    message: `Internal Error`
                                });
                            }
                            else return res.json({
                                status: 1,
                                message: "User Reported as spam"
                            })
                        });
                    }

                    // If the user exists and has not been previously reported by this user, then increase the spam count in the global database.
                    else reportOldUser(reportNumber,(err,result)=>{
                        if(err){
                            return res.status(500).json({
                                success : 0 ,
                                message : `Internal Error`
                            }); 
                        }
                        else return res.json({
                            status:1,
                            message:"User Reported as spam"
                        })
                    })
                })
                
            }
        })
    },

    /**
     * Log's in user after verifying credentials and returning jwt in the response body. 
    */
    login : async(req,res) =>{
        const body = req.body;
        // phone , pass
        getUserForLogin(body.phoneNumber,async (err,resultData)=>{
            if(err){
                return res.status(500).json({
                    success : 0 ,
                    message : `Internal error`
                }); 
            }
            if(resultData==undefined || resultData?.length==0){
                return res.status(401).json({
                    success : 0 ,
                    data : `Invalid Credentials`
                }); 
            }

            compare(body.password,resultData.password,(err, result)=>{
                if(err){
                    return res.status(500).json({
                        success : 0 ,
                        message : `Internal error`
                    }); 
                }
                if(result===false){
                    return res.status(401).json({
                        success : 0 ,
                        data : `Invalid Credentials`
                    }); 
                }
                resultData.password = undefined;
                const jsontoken = sign({result : resultData}, process.env.JWT_KEY,{
                    expiresIn:'2h'
                });
                return res.json({
                    success:1,
                    message:'login successful',
                    token: jsontoken
                });
            });
        })
    }
}