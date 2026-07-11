const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../middlewares.js")
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

    req.login(registeredUser,(err)=>{
        if(err) return next(err)
        req.flash("success","Welcome to airbnb")
        res.redirect("/listings")
    })
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
    
})) 

//login
router.get("/login",(req,res) =>{
    res.render("users/login.ejs")
})

router.post("/login",
   saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), wrapAsync(async(req,res) =>{

    req.flash("success","Successfully logged in")
    let redirectUrl =res.locals.redirectUrl || "/listings" //this is done bcz res.locals.rediretUrl is undefined when logged in directly
    res.redirect(redirectUrl)
    
})) 

//logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","You are logged out!")
        res.redirect("/listings")
    })
})

module.exports = router