const express = require("express")
const router = express.Router()

router.get("/", (req,res) => {
    res.send("all posts")
})

router.get("/:id", (req,res) => {
    res.send("hii.i am particular post")
})

router.post("/", (req,res) => {
    res.send("post for posts")
})

router.delete("/:id", (req,res) => {
    res.send("delete for posts")
})


module.exports = router