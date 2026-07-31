const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../middlewares.js")
const userController = require("../controllers/user.js")

//for signup page
router.route("/signup")
    .get((req, res) => {
        res.render("users/signup.ejs")
    })
    .post(wrapAsync(userController.signUp))


//login
router.route("/login")
    .get((req, res) => {
        res.render("users/login.ejs")
    })
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login))

//logout
router.get("/logout", userController.logout)

module.exports = router