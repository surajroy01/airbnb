const express = require("express")
const router = express.Router()

// router.get("/*", (req,res) => {
//     res.send("hii.i am root")
// })

router.get("/", (req,res) => {
    res.send("all users")
})

router.get("/:id", (req,res) => {
    res.send("hii.i am particular user")
})

router.post("/", (req,res) => {
    res.send("post for users")
})

router.delete("/:id", (req,res) => {
    res.send("delete for users")
})

module.exports = router