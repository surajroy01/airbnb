const mongoose = require("mongoose")
const passport = require("passport")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose")

console.log("TYPE:", typeof passportLocalMongoose);

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    //username and password will automatically given by passportlocalmongoose
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",userSchema)