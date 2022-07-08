module.exports = {
    /**
    *   This function is used to perform basic validation checks on the data send by the client.
    *   More checks can be added according to the needs 
    */ 
    checkDetails : (req,res,next)=>{
        const body = req.body;
        const number = body.phoneNumber;
        const name = body.name;
        const password = body.password;
        if(!name ||!number ||number.length!=10||!password){
            res.status(400).json({
                status:0,
                message:"Invalid data"
            })
        }
      
        next();
    }
}