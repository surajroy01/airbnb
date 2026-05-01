const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js")
const Listing = require("../models/listing.js")
// const methodOverride = require("method-override")
const Review = require("../models/review.js")

//making function for reviewValidation
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

//Review
//post route
router.post("/",validateReview,wrapAsync(async(req,res) => {
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success","Review added!")
    res.redirect(`/listings/${listing.id}`)
    // console.log("review")
}))

//delete route for  review
router.delete("/:reviewId",wrapAsync( async (req,res)=>{
    let {id}=req.params //finding listing and review
    let {reviewId}=req.params
    //delete review
    await Review.findByIdAndDelete(reviewId)

    //deleting the review from the particular listing
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    
    req.flash("success","Review deleted!")

    // console.log(reviewId)
    res.redirect(`/${listing_id}`)
}))

// router.get("/", (req, res) => {
//     res.send("default route")
// })

module.exports = router