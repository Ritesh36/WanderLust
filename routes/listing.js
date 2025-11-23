const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Search Route
router.get("/search", wrapAsync(listingController.searchListings));

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListings));

//Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListings));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.editListings));

//Update Route
router.put("/:id", validateListing, isOwned, upload.single("listing[image]"), wrapAsync(listingController.updateListings));

//Delete Route
router.delete("/:id", isLoggedIn, isOwned, wrapAsync(listingController.deleteListings));

//Like Route
router.post("/:id/like", isLoggedIn, wrapAsync(listingController.toggleLike));

module.exports = router;