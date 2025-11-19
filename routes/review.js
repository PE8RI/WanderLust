const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, IsAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// CREATE & DELETE review
router
  .route("/")
  .post(
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.Createreview)                // POST create review
  );

router
  .route("/:reviewId")
  .delete(
    isLoggedIn,
    IsAuthor,
    wrapAsync(reviewController.Destroyreview)              // DELETE a review
  );

module.exports = router;
