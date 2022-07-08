module.exports = {

    /**
     * To check if the number to be reported as spam sent by the client a valid number or not.
    */
    checkSpamNumber : (req,res,next)=>{
        const body = req.body;
        const number = body.phoneNumber;
        if(!number ||number.length!=10){
            res.status(400).json({
                status:0,
                message:"Invalid number"
            })
        }
        next();
    }
}