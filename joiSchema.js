const joi = require('joi')

module.exports.campSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required().min(0),
    location : joi.string().required(),
    // img : joi.string().required()
    description : joi.string(),
    deleteImages : joi.array()
})

module.exports.reviewSchema = joi.object({
    body : joi.string().required(),
    rating : joi.number().required() 
})