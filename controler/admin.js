const User=require("../model/admin");

const Gamer=require("../model/user");
const Profile=require("../model/profile");

exports.Adminlogin=async(req,res)=>{
 
    try {
        
        // fetch the data from req body
        const{email,password}=req.body;

        //valid data or not
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All filed are require"
            })
        }

        // check user exist or not
        //need to populate game-coin also **REMAINING
        let user=await User.findOne({ email }).populate("additonalDetails");
        if(!user){
            return res.status(500).json({
                success:false,
                message:"User not exsist"
            })
        }

        //compare password
         if(user.password===password)
         {
              // create JWT tokens
              const payload={
                email:user.email,
                id:user._id,
                role: user.accountType
            }
           
            //payload , secretkey ,options
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "1w"
            });
            user.token=token;
            user.password=undefined;
          
            //create cookie
            const options={
                maxAge: 10 * 24 * 60 * 60 * 1000, // Expires after 3 days
                httpOnly: true
            }
          return   res.cookie("token",  token, options).status(200).json({
                success:true,
                token,
                user,
                message:`Logedin successfully and token id ${token}`

            })
         }
          
    
          else{
              return res.status(401).json({
                success:false,
                message:"Password incorect"
            })
          }
          
        
    } catch (error) 
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login fail eroor in network call",
            data:error.message
        })
    }
}

//get all user
exports.getAlluser = async (req, res) => {
    const page = parseInt(req.query.page) || 2; // Get the page number from query parameters or default to 1
    const size = parseInt(req.query.size) || 2; // Get the page size from query parameters or default to 10
     
    try {
      const totalUsers = await Gamer.countDocuments({});
      
      const skip = (page - 1) * size;
      const users = await Gamer.find({}).skip(skip).limit(size);
  
      return res.status(200).json({
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          pageSize: size,
          totalRecords: totalUsers,
          totalPages: Math.ceil(totalUsers / size),
        },
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };
  
//uesr updation by admin
exports.userUpdateByAdmin = async (req, res) => {
    try {
        const { phone, firstName, lastName, email, gameMoney } = req.body;
        const userID = req.params.id;

        // Check if any required field is missing
        if (!phone || !firstName || !lastName || !email || !gameMoney ||!userID) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Find the user by their unique identifier (e.g., email)
        const user = await Gamer.findById({ _id:userID });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update the user's data with the new values
        user.phone = phone;
        user.firstName = firstName;
        user.lastName = lastName;
        user.gameMoney = gameMoney;
        user.email=email;

        // Save the updated user object
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User data updated successfully",
            data: user, // Optionally, you can send the updated user data in the response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

//user deletion by admin
exports.userDeletionByAdmin=async(req,res)=>{

    try {
        const userID = req.params.id;


        const response=await Gamer.findByIdAndDelete({_id:userID});

       return res.status(200).json({
        success:true,
        message:"User deleted successfully"
       })
    } catch (error) {
        
        return res.status(500).json({
            succes:false,
            message:"Intenal server error",
            fault:error.message
        })
    }
}