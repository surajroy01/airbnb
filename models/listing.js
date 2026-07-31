const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.js")//for creating a middleware for deleting review


//creating schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
},
})

//creating post delete middleware for deleting review after that listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})//it runs after listing is deleted 

//creating model
const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing