const mongoose = require("mongoose");
const Reviews = require("./reviews.js");
const { ref, string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: String,
    enum: ["Mountains", "Boats", "Camping", "Iconic-cities", "Rooms", "Farm"]
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;