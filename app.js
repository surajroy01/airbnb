if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const MongoStore = require('connect-mongo').default;//for storing session on  atlas
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const flash = require("connect-flash")
//authentication
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const passportLocalMongoose = require("passport-local-mongoose")

//database
const dbUrl = process.env.ATLAS_DB_URL
async function main() {
    await mongoose.connect(dbUrl)
}
main().then((res) => {
    console.log("connected successfully")
})
    .catch((err) => {
        console.log(err )
    })

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

//mongo session
const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
        
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

//express session
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge : 7 * 24 *60 * 60 * 1000,
        httpOnly : true,
    },
}

app.use(session(sessionOption))
app.use(flash())

//after session always
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//demouser
// app.get("/demouser", async (req,res) =>{
//     let fakeUser= new User({
//         email:"xyz@gmail.com",
//         username: "srj",
//     })

//     let newUser = await User.register(fakeUser,"suraj")
//     res.send(newUser)
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUsr = req.user
    next()
})


app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

//error which will shown when someone goes to different route which doest not  exist
// app.all("/*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"))
// })//this route does not works


//alternative of above route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found"))
})
//for handling server side vallidation like string in place of number

app.use((err, req, res, next) => {
    // res.send("Something went wrong")//without expresserrror class
    let { statusCode=500, message="Something went wrong!" } = err
    res.status(statusCode);
    res.render("error.ejs",{message})
    // res.status(statusCode).send(message)
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("app is listening on port 8080")
})
