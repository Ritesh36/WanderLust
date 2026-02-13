const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Reviews
//Post Review route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReviews));

//Delete review route
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.destroyReviews));

module.exports = router;