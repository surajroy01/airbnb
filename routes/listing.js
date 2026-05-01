const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing = require("../models/listing.js")
const methodOverride = require("method-override")

//using schemavalidation as middleware
const validateListing=(req,res,next)=>{
    let { error } = listingSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else {
        next()
    }
}

//all listings
router.get(
    "/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

//for new listing
router.get(
    "/new", (req, res) => {
    res.render("listings/new.ejs")
})

//creating the listing
//using try catch to handle server side validation or wrapAsync function 
router.post(
    "/",validateListing, wrapAsync(async (req, res, next) => {
    // let {title,....}=req.body   //normally aise kr sakte hain
    // let listing=req.body.listing
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Please enter valid data")
    // }
    const newListing = new Listing(req.body.listing)

    // if(!newListing.title){
    //     throw new ExpressError(400,"Give title")//shows error if title is missing
    // }
    //   if(!newListing.description){
    //     throw new ExpressError(400,"Give description")//shows error if description is missing
    // }

    //using Joi validation instead of if
    await newListing.save()
    // console.log(req.body)
    req.flash("success","New Listing is added!")//for showing a success message of listing added
    res.redirect("/listings")
}))

//editing single listing
router.get(
    "/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    else{
        res.render("listings/edit.ejs", { listing })
    }
    
}))

//updating
router.put(
    "/:id",validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Please enter valid data")
    }
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success","Listing updated")//for showing a success message
    res.redirect("/listings")
    // res.redirect(`/listings/${id}`)//for redirecting to particular listing which is being edited
}))

//deleting particular listing
router.delete(
    "/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listing deleted")
    res.redirect("/listings")
}))

//particular hotel//show route
router.get(
    "/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")//populate is used to get details about reviews
    if(!listing){
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    else{
    res.render("listings/show.ejs", { listing })
    }
}))


// router.get("/mylisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"Paradise Hotel",
//         description:"It's a comfortable hotel.",
//         price:2400,
//         location:"Salt lake,Kolkata",
//         country:"India",
//     })

//     await sampleListing.save()
//     console.log("Sample was saved.")
//     res.send("successfully testing")
// })

module.exports = router