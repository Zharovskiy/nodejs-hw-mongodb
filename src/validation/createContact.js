import Joi from "joi";

export const createContactSchema = Joi.object({
name: Joi.string().required().min(3).max(20).messages({
    'any.required': 'Is Required',
    'string.min': 'Min string length is not achieved',
    'string.max': 'Max string length is not achieved',
}),
phoneNumber: Joi.string().required().min(3).max(20),
email: Joi.string().email(),
isFavourite: Joi.boolean(),
contactType: Joi.string().valid('work', 'home', 'personal'),
userId: Joi.string(),
});

  