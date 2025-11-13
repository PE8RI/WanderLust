const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{reviewSchema}=require("../utils/schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
 

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next(); // proceed if validation passes
  }
}


router.post("/",validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review !");
  res.redirect(`/listings/${listing._id}`);
 }));

//Delete Review Route

 
router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
   await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted!");
res.redirect(`/listings/${id}`);
});

module.exports=router;