const { cloudinary } = require("../cloudConfig");
const ExpressError = require("../utils/ExpressError");
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

  // Debugging – SEE if file is being uploaded
  console.log("REQ.FILE =", req.file);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Only store image if multer received it
  if (req.file) {
    newListing.image = {
      url: req.file.path,          // Cloudinary URL
      filename: req.file.filename  // Cloudinary public_id
    };
  }

  await newListing.save();

  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};


// Render form to edit a listing
module.exports.Edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  // Cloudinary URL transformation
  let originalurl = listing.image.url;
  let smallImageUrl = originalurl.replace("/upload", "/upload/w_250");

  res.render("listing/edit.ejs", { listing, smallImageUrl });
};


// Update an existing listing
module.exports.Update = async (req, res, next) => {
  // If request data missing
  if (!req.body.listing) {
    return next(new ExpressError(400, "Bad Request"));
  }

  const { id } = req.params;

  // Find listing first
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update text fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.location = req.body.listing.location;

  // If new image uploaded
  if (req.file) {
    // Delete old image from Cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Store new image from Cloudinary
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();

  req.flash("success", "Listing successfully updated!");
  res.redirect(`/listings/${id}`);
};
// Delete a listing
module.exports.Delete = async (req, res) => {
  const { id } = req.params;

  // Find listing before deleting (so we can delete image)
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Delete image from Cloudinary
  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  // Delete document from MongoDB
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing and image deleted!");
  res.redirect("/listings");
};

