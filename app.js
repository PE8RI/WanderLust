const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

 
//routers listing
const listingRouter = require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main().then((res)=>{
  console.log("Connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/",(req,res)=>{
  res.send("working");
})

 
 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
 
//error handling

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong"}=err;
  res.status(status).render("error.ejs",{err});
})

app.listen(8080,(req,res)=>{
  console.log("Server started")
})