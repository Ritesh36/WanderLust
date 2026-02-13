const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReviews = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newListing = new Review(req.body.review);
    newListing.author = req.user._id;
    // console.log(newListing);
    listing.reviews.push(newListing);
    await newListing.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReviews = async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}