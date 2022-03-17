const joi = require('joi');

const registerSchema = joi.object({
    username: joi.string()
        .min(3)
        .required(),
    password: joi.string()
        .min(6)
        .required(),
    email: joi.string().
        email({ 
            minDomainSegments: 2,
            tlds: { allow: true } 
        }),
});

const loginSchema = joi.object({
    username: joi.string()
        .min(3)
        .required(),
    password: joi.string()
        .min(6)
        .required(),
});

const seasonCreateSchema = joi.object({
    title: joi.string()
        .required(),
    competitionId: joi.any() //change to reflect incoming from front end
        .required(),
    participants: joi.array()
        .required(),
    teams: joi.array()
        .required(),
    positionMappings: joi.array()
        .required(),
})

module.exports = {
    registerSchema,
    loginSchema,
    seasonCreateSchema,
};