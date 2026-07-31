const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const methodOverride = require("method-override")
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js")

const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
// const upload = multer({ dest: 'uploads/' })//stores files in uploads folder temporarily
const upload = multer({ storage })
//combining same path having different routes
router
    .route("/")
    .get(wrapAsync(listingController.index))//all listing
    .post(isLoggedIn, 
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createNewListing))//creating the listing
//using try catch to handle server side validation or wrapAsync function

//for new listing and authenticating user using middleware
router.get(
    "/new", isLoggedIn, listingController.newForm)

router.route("/:id")
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))//updating

    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))//deleting particular listing

    .get(wrapAsync(listingController.showListing))//particular hotel//show route

//editing single listing
router.get(
    "/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing))


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