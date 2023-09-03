const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin"]
    },
    
    withdrawlReq:[],

    //token for reset password
    token:{
        type:String
    },


    resetPassExpires:{
        type:Date
    },

  
});

module.exports=mongoose.model("Admin", userSchema);