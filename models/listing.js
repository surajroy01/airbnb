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
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://i.pinimg.com/1200x/e7/b9/0d/e7b90dfc8ab45cd25c18641be918a858.jpg",
            set: (v) => v === "" ? undefined : v
        },
        // set:(v)=>v===""? "https://i.pinimg.com/1200x/e7/b9/0d/e7b90dfc8ab45cd25c18641be918a858.jpg":v,
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
    }
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