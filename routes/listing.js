const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, Isowner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))                     // GET all listings
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.Create)
  )

// NEW (only form page)
router.get("/new", isLoggedIn, listingController.New);

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.Show))                       // GET single listing
  .put(
    isLoggedIn,
    Isowner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.Update)                        // PUT update listing
  )
  .delete(
    isLoggedIn,
    Isowner,
    wrapAsync(listingController.Delete)                        // DELETE listing
  );

// EDIT FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  Isowner,
  wrapAsync(listingController.Edit)
);

module.exports = router;
