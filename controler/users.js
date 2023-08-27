const User=require("../model/user")

exports.getSingleUserdata=async(req,res)=>{

    try {
        const userID=req.params.id;

        const id=req.user.id;

       if(req.user.role !=="Admin" && id!==userID )
        {
                return res.status(500).json({
                    success:false,
                    message:"Something went wong"
                   })
        }

      

        if(!userID)
        {
            return res.status(404).json({
                success:false,
                messahe:"user id not found"
            })
        }

        const userData=await User.findById(userID);

        return res.status(200).json({
            success:true,
            message:"Successfully get user data",
            data:userData,
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }
}
