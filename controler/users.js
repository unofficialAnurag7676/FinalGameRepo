const User=require("../model/user")

exports.getSingleUserdata=async(req,res)=>{

    try {
        const {userID}=req.body;

        if(!userID)
        {
            return res.status(404).json({
                success:false,
                messahe:"useid not found"
            })
        }

        const userData=await User.findById(userID).populate("gameMoney");

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
exports.getAlluser=async(req,res)=>{


    try {
    const Users=await User.find({}).populate("gameMoney");

        return res.status(200).json(({
            success:true,
            data:Users

        }))

    } catch (error) {
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }
}