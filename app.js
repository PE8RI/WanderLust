if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
 
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user");

 
//routers listing
const listingRouter = require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

 

main()
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}


const SessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.get("/",(req,res)=>{
  res.send("working");
})

app.use(Session(SessionOptions));
app.use(flash()); 
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser = req.user;
  next();
})
 
 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
 
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