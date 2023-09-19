const bcrypt=require("bcrypt");
const User=require("../model/user")
const OTP=require("../model/otp")
const EmailOTP=require("../model/emailOtp")
const otpGenerator=require("otp-generator")
const jwt=require("jsonwebtoken");


const mailsender=require("../mail/mailSender");
const emailOtp = require("../model/emailOtp");
const Admin=require("../model/admin");

require("dotenv").config();

// send OTP via email for admin verification
exports.sendOTP=async(req,res)=>{

    try {
        
        const{email}=req.body;
        const userExsist=await User.findOne({email});


        // generate otp
      var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
      });

      //check the unique otp or not
      let result= await EmailOTP.findOne({otp:otp});

      while(result)
      {
        otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
          });
          result= await EmailOTP.findOne({otp:otp});
      }

      const otpPayload={email ,otp};
      const otpBody=await EmailOTP.create(otpPayload);
      
      await mailsender(email,"OTP verification",otp);
      
      res.status(200).json({
        success:true,
        message:"Otp sent sucessfully",

      })
    } catch (error) {

        res.status(500).json({
            success:false,
            message:error.message,

        })
    }
};

//verify otp/sign in for api for Admin
exports.verifyOtp=async(req,res)=>{

    try {

        const{otp,email}=req.body;

        const recentOTP=await emailOtp.findOne({email:email}).sort({createdAt:-1}).limit(1);


        let user=await Admin.findOne({ email})
        if(recentOTP.length ===0)
       {
        return res.status(400).json({
            success:false,
            message:"OTP not found"
        })
       }

       else if(otp !==recentOTP.otp){
        return res.status(401).json({
            success:false,
            message:"Invalid otp",
            
        });
    } 

    else{
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
  }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}

// sign in api for Gammer
exports.signup=async(req,res)=>{

    try {
        const{
            firstName,
            lastName,
            email,
            accountType,
            contactNumber,
            otp
             }=req.body;

        // verify otp , cause user only done sign up when email verififcation done before create a new entry in DB
        if(!firstName || !lastName || !email || !contactNumber || !accountType || !otp)
        {
            return res.status(403).json({
                success:false,
                message:"all field are require"
            })
        }   
        

         // check user already present
         if(await User.findOne({email}))
         {
             return res.status(400).json({
                 success:false,
                 message:"user already exsist"
             })
         }

         //check otp are valid or not
         const recentOTP=await OTP.findOne({phone:contactNumber}).sort({createdAt:-1}).limit(1);

         if(!recentOTP || otp!==recentOTP.otp)
         {
            return res.status(404).json({
                message:"Invalid otp"
            })
         }

       //finaly create user in Data Base
       const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        gameMoney:0,
        accountType,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
       });

       //create token for token
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
  
    //create cookie
    const options={
        maxAge: 10 * 24 * 60 * 60 * 1000, // Expires after 3 days
        httpOnly: true
    }

    return res.cookie("token",  token, options).status(200).json({
        success:true,
        token,
        user,
        message:`Logedin successfully and token id ${token}`

    })


    } 
    
    catch (error) {
        return res.status(401).json({
            success:false,
            message:"Error in creating user",
            data:error.message,
        })
    }
}

// login api
exports.login=async(req,res)=>{

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
        if(await bcrypt.compare(password,user.password)){
         
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

// mobile otp snding for gammer
exports.mobileOtpSender = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const accountSid = "AC16e9ace54ce4cc107ae9f67b9f6dccae";
      const authToken = "d88d982fd7ccb35a6d8ba57e0e7a1a98";
      const verifySid = "VAd6839986cb2fd6d59f2b63a03cda6a50";
      const client = require("twilio")(accountSid, authToken);
      
    //   const messagingServiceSid='MG8ef05b18834016b53836c1ed09b36f07'

      var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
      });
       
     const response= await client.messages.create(
        {
            from: '+12562861971',
            body:`your otp is ${otp}`,
            to:`+91${phoneNumber}`
        }
      );
      const otpPayload={phoneNumber ,otp};
      await OTP.create(otpPayload);
      return res.status(200).json({
           success:true,
           message:'otp send successfully',
           response
          })
     
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({
        success: false,
        message: "Failed to send OTP",
        fault: error.message,
      });
    }
  };
  



