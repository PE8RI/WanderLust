const express = require("express");
const router = express.Router();
const User=require("../models/user.js")
const passport=require("passport") ;
const {SaveRedirectUrl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
  res.render("users/signup.ejs");
})

router.post("/signup",async(req,res)=>{
  try{
    let{email,username,password}=req.body;
    const newUser=new User({email,username});
    const registered= await User.register(newUser,password);
    console.log(registered);
    req.login(registered,(err)=>{
      if (err) { 
        return next(err);
       }
       req.flash("success","You are successfully logged in")
       res.redirect("/listings");
  });
     
  }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/signup")
   }
})

router.get("/login",(req,res)=>{
  res.render("users/login.ejs");
})

router.post(
  "/login",
  SaveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    let redirectUrl = res.locals.RedirectUrl || "/listings";
    req.session.RedirectUrl = null; 
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      return next(err);
     }
    req.flash("success", "You have logged out!");
    res.redirect("/login");
  });
});


module.exports=router;