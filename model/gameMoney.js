const mongoose=require("mongoose");

const gameMoneySchema=new mongoose.Schema({
      
     userDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     coins:{
        type:Number,
     }
});

module.exports=mongoose.model("GameCurency",gameMoneySchema)