const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview=async(req,res) => {
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview)
    newReview.author=req.user._id
    await newReview.save()
    await listing.save()
    req.flash("success","Review added!")
    res.redirect(`/listings/${listing.id}`)
    // console.log("review")
}

module.exports.deleteReview=async (req,res)=>{
    let {id}=req.params //finding listing and review
    let {reviewId}=req.params
    //delete review
    await Review.findByIdAndDelete(reviewId)
    // console.log(id)
    //deleting the review from the particular listing
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    
    req.flash("success","Review deleted!")

    // console.log(reviewId)
    
    res.redirect(`/listings/${id}`)
}