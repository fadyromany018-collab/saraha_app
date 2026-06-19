import joi from "joi"
import { GenderEnum } from "../../common/enum/user.enum.js"
import {general_rules} from "../../utils/generalRules.js"
export const signUpSchema = {
  body: joi.object({
    userName: joi.string().min(5).max(40).required(),
    email: general_rules.email.required(),
    phone: joi.string()
    .pattern(/^(\+20|0)?1[0125][0-9]{8}$/)
    .required()
    .messages({
    "string.pattern.base": "Please enter a valid Egyptian phone number"
    }),
    password: general_rules.password.required()
      .messages({
        "string.pattern.base": "Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number."
      }),
    cPassword: general_rules.cPassword,
    gender: joi.string().valid(...Object.values(GenderEnum)),
    
  }).required(),
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
export const signInSchema={
    body: joi.object({
        email:joi.string().required(),
        password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-z])(?=.*[a-zA-Z]).{8,}$/)
    }).required(),
    query:joi.object({
      x:joi.number().min(20),
    }).required()

} 
export const shareProfileSchema={
    params: joi.object({
      id:general_rules.id.required(),
    }).required()
}  
export const updateProfileSchema={
    body: joi.object({
      firstName: joi.string().min(4).max(40),
      lastName: joi.string().min(4).max(40),
      gender:joi.string().valid(...Object.values(GenderEnum)),
      phone:joi.string()
    
    }).required()
}  
export const updatePasswordSchema={
    body: joi.object({
      newPassword:general_rules.password.required(),
          cPassword: joi.valid(joi.ref("newPassword")).required().messages({
            "any.only": "Passwords do not match."
          }),
          oldPassword:general_rules.password.required(),
     
      
    
    }).required()
}  
export const confirmEmailSchema = {
    body: joi.object({
        email:joi.string().required(),
        otp:joi.string().length(6).regex(/^\d{6}$/).required(),
    }).required()

} 
export const reSendOtpSchema={
  body:joi.object({
    email:general_rules.email.required()
  }).required()
}

export const resetPasswordSchema={
    body: joi.object({
        email:joi.string().required(),
        password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-z])(?=.*[a-zA-Z]).{8,}$/),
                  cpassword: joi.valid(joi.ref("password")).required().messages({
            "any.only": "Passwords do not match."
          }),
         otp:joi.string().length(6).regex(/^\d{6}$/).required()

    }).required()
}  