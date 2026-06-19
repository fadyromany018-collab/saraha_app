import joi from "joi"
import {Types} from "mongoose"

const customId = (v,h)=>{
  const value=Types.ObjectId.isValid(v)
  return value?v:h.message("id is not valid ")
}

export const general_rules = {

   email: joi.string().email(),
    password: joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .required()
      .messages({
        "string.pattern.base": "Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number."
      }),
    cPassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Passwords do not match."
    }),
      id:joi.string().custom((value, helper)=>{
        const isValid= Types.ObjectId.isValid(value)
        return isValid? value:helper.message("inValid id")
      }),

  id:joi.string().custom(customId),
  file:joi.object({
    fieldname:joi.string().required(),
    originalname:joi.string().required(),
    encoding:joi.string().required(),
    mimetype:joi.string().required(),
    destination:joi.string().required(),
    filename:joi.string().required(),
    path:joi.string().required(),
    size:joi.number().required(), 
  }).required().messages({
    'any.required':"file is required"
  })
} 