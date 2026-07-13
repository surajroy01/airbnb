require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose")
const initData = require("./data.js")//for data
const Listing = require("../models/listing.js")//for schema

//database connectivity
// const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB"
const dbUrl = process.env.ATLAS_DB_URL
async function main() {
    await mongoose.connect(dbUrl)
}
main()
    .then((res) => {
        console.log("connected successfully")
    })
    .catch((err) => {
        console.log(err)
    })

const initDB = async () => {
    // await Listing.deleteMany({})
    //  initData.data=initData.data.map((obj)=>({...obj,owner:"69f3163240dcd09ccc3deaa0",}))
    await Listing.insertMany(initData.data)
    console.log("database was initialised.")
}

initDB()