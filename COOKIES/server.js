const express = require("express")
const app = express()
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const path = require("path")
// const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// app.use(cookieParser())
// app.use(cookieParser("secretcode"))//for signed cookies

app.use("/users",users)
app.use("/posts",posts)
app.use(flash())

//express session
app.use(session({
    secret:"myfirststring",
    resave:false,
    saveUninitialized: true,
}))

//using flash as middleware
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errorMsg=req.flash("failure")
    next()
})
//counting number of session
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else {
//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times.`)
// })

//storing information
app.get("/register",(req,res)=>{
    let {name ="anonymous"} =  req.query
    req.session.name = name
    // res.send(`${req.session.name}`)
    if(name==="anonymous"){
        req.flash("failure","user not registered")
    }
    else{
        req.flash("success","user registered successfully!")
    }
    
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    // res.send(`hello ${req.session.name}`)
    res.render("page.ejs",{name: req.session.name})
})
// app.get("/test",(req,res)=>{
//     res.send("Test successful")
// })

//COOKIE PART
// //sending cookies
// app.get("/getcookies", (req,res) => {
//     res.cookie("greet","namaste")
//     res.cookie("madeIn","India")
//     res.send("i am cookie")
// })

// //signedcookies
// app.get("/getsignedcookies", (req,res) => {
//     res.cookie("greet","namaste",{ signed : true})
//     res.send("i am signed cookie")
// })

// //verifying
// app.get("/verify",(req,res) => {
//     console.log(req.signedCookies)
//     res.send("verified")
// })

// //parsing cookie
// app.get("/",(req,res) => {
//     console.dir(req.cookies)
//     res.send("hii, i am root")
// })

// app.get("/greet",(req,res) => {
//     let {name = "anonymous"}=req.cookies
//     res.send(`hii, ${name}`)
// })

app.listen(3000,()=>{
    console.log("app is listening on port 3000")
})