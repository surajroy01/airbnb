const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const methodOverride = require("method-override")
const Review = require("../models/review.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js")
const reviewController = require("../controllers/review.js")



//Review
//post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//delete route for  review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))

// router.get("/", (req, res) => {
//     res.send("default route")
// })

module.exports = router 