const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const methodOverride = require("method-override")
const {isLoggedIn, isOwner,validateListing}=require("../middlewares.js")

const listingController=require("../controllers/listing.js")

//all listings
router.get("/", wrapAsync(listingController.index))

//for new listing and authenticating user using middleware
router.get(
    "/new", isLoggedIn,listingController.newForm)

//creating the listing
//using try catch to handle server side validation or wrapAsync function 
router.post(
    "/",isLoggedIn, validateListing, wrapAsync(listingController.createNewListing))

//editing single listing
router.get(
    "/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing))

//updating
router.put(
    "/:id", isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))

//deleting particular listing
router.delete(
    "/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

//particular hotel//show route
router.get(
    "/:id", wrapAsync(listingController.showListing))


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