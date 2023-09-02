const mongoose=require("mongoose");

const payment= new mongoose.Schema({

   paymentStatus:{
     type:String,
     default:"Process"
   },

   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   
   
  
});

module.exports=mongoose.model("Payment", payment);