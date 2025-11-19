const Listing=require("../models/listing");
const Review=require("../models/review");


//Create Review
module.exports.Createreview=async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview .Author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review !");
  res.redirect(`/listings/${listing._id}`);
 };


 //Delete Review
 module.exports.Destroyreview=async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}