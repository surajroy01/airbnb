const Listing=require("../models/listing")
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.newForm=(req, res) => {
        res.render("listings/new.ejs")
}

module.exports.createNewListing=async (req, res, next) => {
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

        //for owner
        newListing.owner=req.user._id
        //using Joi validation instead of if
        await newListing.save()
        // console.log(req.body)
        req.flash("success", "New Listing is added!")//for showing a success message of listing added
        res.redirect("/listings")
}
module.exports.editListing=async (req, res) => {
        let { id } = req.params
        const listing = await Listing.findById(id)
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist")
            res.redirect("/listings")
        }
        else {
            res.render("listings/edit.ejs", { listing })
        }

}

module.exports.updateListing = async (req, res) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "Please enter valid data")
        }
        let { id } = req.params
        await Listing.findByIdAndUpdate(id, { ...req.body.listing })
        req.flash("success", "Listing updated")//for showing a success message
        res.redirect(`/listings/${id}`)
        // res.redirect(`/listings/${id}`)//for redirecting to particular listing which is being edited
}
module.exports.deleteListing = async (req, res) => {
        let { id } = req.params
        await Listing.findByIdAndDelete(id)
        req.flash("success", "Listing deleted")
        res.redirect(`/listings`)
}

module.exports.showListing = async (req, res) => {
        let { id } = req.params
        const listing = await Listing.findById(id).populate({path:"reviews",populate :{path:"author",},}).populate("owner")//populate is used to get details about reviews
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist")
            res.redirect(`/listings/${id}`)
        }
        else {
            res.render("listings/show.ejs", { listing })
        }
}