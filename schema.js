const Joi=require("joi")

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),//min value of price is 0
        country:Joi.string().required(),
        image:Joi.object({
            filename:Joi.string().allow("",null).required(),
            url:Joi.string().allow("",null).default("https://i.pinimg.com/1200x/e7/b9/0d/e7b90dfc8ab45cd25c18641be918a858.jpg")
        }),//no value or default value
    }).required()
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),
    }).required()
})