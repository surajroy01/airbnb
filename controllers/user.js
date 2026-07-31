const User = require("../models/user")

module.exports.signUp=async(req,res) =>{
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
    
}

module.exports.login=async(req,res) =>{
    req.flash("success","Successfully logged in")
    let redirectUrl =res.locals.redirectUrl || "/listings" //this is done bcz res.locals.rediretUrl is undefined when logged in directly
    res.redirect(redirectUrl)
    
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","You are logged out!")
        res.redirect("/listings")
    })
}