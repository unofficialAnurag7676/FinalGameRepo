const jwt=require("jsonwebtoken");
exports.generateToken=async(email,id,role)=>{

    try {
        
        console.log(id);

        const payload={
            email,
            id,
            role
        }
       
        //payload , secretkey ,options
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn: "1w"
        });

        return token;
    } catch (error) {
        
        
        console.log("error in generate token",error.message)
    }
}