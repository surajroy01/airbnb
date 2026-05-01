const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
//for signup page
router.get("/signup",(req,res) =>{
    res.render("users/signup.ejs")
})

//post for signup
router.post("/signup", wrapAsync(async(req,res) =>{
    try{
        let {username,email,password} = req.body

    // console.log(req.body)
    const newUser= new User({username,email})

    const registeredUser= await User.register(newUser,password)
    // console.log(registeredUser)

    req.flash("success","User was registered")
    res.redirect("/listings")
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
    
})) 

//login
router.get("/login",(req,res) =>{
    res.render("users/login.ejs")
})

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), wrapAsync(async(req,res) =>{

    req.flash("success","Successfully logged in")
    res.redirect("/listings")
    
})) 

module.exports = router