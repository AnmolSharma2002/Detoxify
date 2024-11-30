const Joi = require('joi');

//Define to validate User

const userSchema = Joi.object({
    name:Joi.string().required().min(3),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
});

const validateUser = (req,res,next)=>{
    const { error } = userSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    next();
};

module.exports = validateUser;