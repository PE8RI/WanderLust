const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
  comment:{
    type:String
  },
  rating:{
    type:Number,
    min:1,
    max:5
  },
  CreatedAt:{
    type:Date,
    default:Date.now()
  }, 
  Author:{
    type: Schema.Types.ObjectId,
    ref:"User",
  }
})

module.exports=mongoose.model("Review",reviewSchema);