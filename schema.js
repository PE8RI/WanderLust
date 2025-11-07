// utils/listingSchemaValidation.js
const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow('', null),  // allows empty string or null
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});
module.exports = { listingSchema };
