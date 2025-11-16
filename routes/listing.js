const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const{isLoggedIn,Isowner,validateListing}=require("../middleware.js")

//index route
router.get("/",async (req,res)=>{
  let allListings=await Listing.find({});
  res.render("listing/index.ejs",{allListings});
})

//New Route
router.get("/new", isLoggedIn,(req, res) => {
  res.render("listing/new.ejs");
});


//show route
router.get("/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id).populate(
    {
      path:"reviews",
      populate:{
      path:"Author",
  },
}).populate("owner");
  if(!listing){
    req.flash("error","This lisiting is Invalid!");
    return res.redirect("/listings")
  }
   res.render("listing/show.ejs",{listing});
}));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {

  // Create new listing
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  await newListing.save();
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit",isLoggedIn,Isowner,wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
}));

//Update Route
router.put("/:id",isLoggedIn,Isowner,validateListing,wrapAsync(async (req, res,next) => {
    if(!req.body.listing){
    next(new ExpressError(400,"Bad Request"));
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
  req.flash("success","Listing is Succesfully Updated!");
  res.redirect(`/listings/${id}`);
}));

// //Delete Route
router.delete("/:id",isLoggedIn,Isowner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success","lisiting deleted!");
   res.redirect("/listings");
}));


module.exports=router;