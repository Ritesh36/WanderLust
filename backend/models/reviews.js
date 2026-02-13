const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: String,
    ratings: {
        type: Number,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Review", reviewSchema);