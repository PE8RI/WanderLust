const Listing = require("../models/listing");

// Show all listings
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
};

// Render form to create a new listing
module.exports.New = (req, res) => {
  res.render("listing/new.ejs");
};

// Show details of a single listing
module.exports.Show = async (req, res) => {
  let { id } = req.params;

  // Find listing by ID and populate reviews + owner
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "Author", // populate review author
      },
    })
    .populate("owner"); // populate listing owner

  // If listing not found
  if (!listing) {
    req.flash("error", "This listing is Invalid!");
    return res.redirect("/listings");
  }

  res.render("listing/show.ejs", { listing });
};

// Create a new listing
module.exports.Create = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // add logged-in user as owner
  await newListing.save();
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

// Render form to edit a listing
module.exports.Edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
};

// Update an existing listing
module.exports.Update = async (req, res, next) => {
  // If request data missing
  if (!req.body.listing) {
    next(new ExpressError(400, "Bad Request"));
  }

  let { id } = req.params;

  // Update listing with new data
  await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  req.flash("success", "Listing is Succesfully Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.Delete = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted!");
  res.redirect("/listings");
};
