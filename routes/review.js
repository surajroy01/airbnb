const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const methodOverride = require("method-override")
const Review = require("../models/review.js")
const {validateReview,isLoggedIn,isReviewAuthor} =require("../middlewares.js")



//Review
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res) => {
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview)
    newReview.author=req.user._id
    await newReview.save()
    await listing.save()
    req.flash("success","Review added!")
    res.redirect(`/listings/${listing.id}`)
    // console.log("review")
}))

//delete route for  review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync( async (req,res)=>{
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
}))

// router.get("/", (req, res) => {
//     res.send("default route")
// })

module.exports = router 