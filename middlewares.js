const Listing =require("./models/listing")
const Review =require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")

//middleware function for logging in 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl //this is where we should go
        req.flash("error", "Please login to add new listing.")
        // return res.redirect("/listings")
        return res.redirect("/login")
    }
    next()
}

//post login page
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl//storing in  locals as it can not be changed by postman because postman refreshes the session
    }
    next()
}

module.exports.isOwner =async (req, res, next) => {
    let {id}=req.params
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.currUsr._id)) {
        req.flash("error", "You are not the owner")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.
validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}
//making function for reviewValidation
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId}=req.params
    let review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}