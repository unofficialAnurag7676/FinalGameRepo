const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
  
    // Define the role field with type String and enum values of "Admin", "Gammer"
    accountType:{
        type:String,
        required:true,
        enum:["Gammer"]
    },

    active: {
        type: Boolean,
        default: true,
    },
 
    phone:{
        type:Number,
        default: true,
        require:true,
    },


    //token for reset password
    token:{
        type:String
    },

    totalWinCoin:{
        type:Number,
        default:0,
        required:true
        
    },
    currentCoin:{
        type:Number,
        default:0,
        required:true
    },

    resetPassExpires:{
        type:Date
    },

    image:{
        type:String,
        
    },
    withdrwalLimit:{
        type:Number,
        default:0
    },
    paymentAddress:{
        tyep:String,
    },
    totalPaymetRecived:{
        type:Number,
        default:0,
        required:true,
    },
   
  payment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Payment"
  }
  
});

module.exports=mongoose.model("User", userSchema);