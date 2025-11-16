const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./utils/schema.js");
 

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.RedirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.SaveRedirectUrl = (req, res, next) => {
  if (req.session.RedirectUrl) {
    res.locals.RedirectUrl = req.session.RedirectUrl;
  }
  next();
};

module.exports.Isowner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if(!listing.owner._id.equals(req.user._id)){
    req.flash("error","you are not the owner of this lisiting!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing=(req, res, next)=> {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next(); // proceed if validation passes
  }
}

module.exports.validateReview=(req, res, next)=> {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next(); // proceed if validation passes
  }
}

module.exports.IsAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;   // listing id + review id

  const review = await Review.findById(reviewId);   // ⭐ CORRECT

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  // ⭐ Check if logged-in user is the review author
  if (!review.Author._id.equals(req.user._id)) {
    req.flash("error", "You are not authorized to delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

