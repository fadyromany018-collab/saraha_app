import userModel from "../models/user.model.js";
import revokeTokenModel from"../models/revokeToken.model.js"
import {encrypt} from"../../utils/security/encrypt.security.js"
import {decrypt} from"../../utils/security/decrypt.security.js"
import {Hash,Compare} from "../../utils/security/hash.security.js"
import { successResponse } from "../../utils/response.success.js";
import * as db_service from"../db.service.js"
import { v4 as uuidv4 } from 'uuid';
import { ProviderEnum } from "../../common/enum/user.enum.js";
import { GenerateToken,VerifyToken } from "../../utils/security/token.service.js";
import {OAuth2Client} from 'google-auth-library';
import {PREFIX,REFRESH_SECRET_KEY,SECRET_KEY,SALT_RNDS } from "../../../config/config.service.js";
import cloudinary from "../../utils/cloudinary.js";
import {randomUUID} from "crypto"
import {setValue,keys,deleteKey,revoked_key,get_key,ttl,otp_key,get,incr} from "../redis/redis.service.js"
import {sendEmail , generateOtp} from "../../utils/email/send.email.js"
import {eventEmitter} from "../../utils/email/email.events.js"
import {emailTemplate} from "../../utils/email/email.templete.js"
import {emailEnum} from "../../common/enum/email.enum.js"





const asyncHandler=(fn)=>{
     return (req,res, next)=>{
          fn(req,res,next).catch((error)=>{
               next(error)
          })
     }

}
//------------------
export const sendEmailOtp=async({email,subject }={})=>{

    const isBlocked= await ttl(block_otp_key({email}))
    if(isBlocked>0){
     throw new Error(`you are blocked, please try again after ${isBlocked} seconds`)
    }
     const otpTTl =await ttl(otp_key({email,subject}))
    if(otpTTl>0){
     throw new Error(`you can resend otp after ${otpTTl} seconds`)
    }
    const maxOtp = await get(max_otp_key({email:email}))
    if(maxOtp>3){
     await setValue({key:block_otp_key({email}),value:true,ttl:60*3})
     throw new Error("you have exceeded the maximum number of tries");
    }
      const otp=await generateOtp()
     eventEmitter.emit(emailEnum.confirmEmail,async()=>{
          await sendEmail({
          to:email,
          subject:"welcome to saraha app",
          html:emailTemplate(otp),
          attachments:[]
       })
       await setValue({key:otp_key({email,subject}),value:await Hash({plainText:`${otp}`,salt_rounds: SALT_RNDS}),ttl:60*2})
       await incr(max_otp_key({email:email}))
    
          })

}
//-------------------
export const signUp =  async(req,res,next)=>{ 
       const {userName,email,password,age,gender,phone,confirmed}=req.body;
   
       const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
          folder:"sarah_app/users",
          resource_type:"image"
       })
     // const user =await db_service.create({
          // model:userModel,
          // data:{
          //      userName,
          //      email,
          //      password,
          //      gender,
          //      age,
          //      phone:encrypt(phone),
          //      profilePicture:{
          //           secure_url,public_id
          //      }
          //      //converPicture:arr_paths
          // }
     // })
       const User= await db_service.findOne({model:userModel,filter:{email}});
     if (User){
           throw new Error("email already exist",{cause:400});
          }
          // let arr_paths=[]
          // for(const file of req.file.attachment){
          //      console.log(req.file)

          //     arr_paths.push(file.path)

          // }
        const hashedPassword = await Hash({ plainText: password ,salt_rounds: SALT_RNDS });   
         const NewUser= await userModel.create({userName,email,password:hashedPassword,phone:encrypt(phone),profilePicture:{secure_url,public_id},coverPicture:{secure_url,public_id},confirmed});
          const otp=await generateOtp()
          eventEmitter.emit(emailEnum.confirmEmail,async()=>{
          await sendEmail({
          to:email,
          subject:"welcome to saraha app",
          html:emailTemplate(otp),
          attachments:[]
       })
     await setValue({key:otp_key({email,subject:emailEnum.confirmEmail}),value:await Hash({plainText:`${otp}`,salt_rounds: SALT_RNDS}),ttl:60*2})
       await setValue({key:max_otp_key({email}),value:1,ttl:60})

          })
          res.status(201).json({message:"done",NewUser})
    }

//------------------------otp
export const confirmEmail=async(req,res,next)=>{
     const{email,otp}=req.body
     const otpValue=await get(otp_key({email}))
     

     if(!otpValue){
          throw new Error("otp expired")
     }
     if(!Compare({plainText:otp,cipherText:otpValue})){
          throw new Error("inValid otp")
     } 
     const user = await db_service.findOneAndUpdate({
          model:userModel,
          filter:{email},
          update:{confirmed:true}
     })
     if(!user){
          throw new Error("user not exist")
     }
     await deleteKey(otp_key({email,subject:emailEnum.confirmEmail}))
     successResponse({res,message:"email confirmed successfully"})
}
export const resendOtp=async(req,res,next)=>{
     const {email}=req.body
const user = await db_service.findOne({model:userModel, filter:{email, confirmed:false}});
    if(!user){
     throw new Error("user not exist or already confirmed");
    }
    const isBlocked= await ttl(block_otp_key({email}))
    if(isBlocked>0){
     throw new Error(`you are blocked, please try again after ${isBlocked} seconds`)
    }
     const otpTTl =await ttl(otp_key({email}))
    if(otpTTl>0){
     throw new Error(`you can resend otp after ${otpTTl} seconds`)
    }
    const maxOtp = await get(max_otp_key({email:email}))
    if(maxOtp>3){
     await setValue({key:block_otp_key({email}),value:true,ttl:60*3})
     throw new Error("you have exceeded the maximum number of tries");
    }
      const otp=await generateOtp()
       await sendEmail({
          to:email,
          subject:"welcome to saraha app",
          html:emailTemplate(otp),
          attachments:[]
       })
       await setValue({key:otp_key({email}),value:await Hash({plainText:`${otp}`,salt_rounds: SALT_RNDS}),ttl:60*2})
       await incr(max_otp_key({email:email}))
    
     res.status(201).json({message:"done"})
   
}

export const max_otp_key=({email})=>{
      return `${otp_key({email})}::max_tries`
}
export const block_otp_key=({email})=>{
     return `${otp_key({email})}::block`
}

export const signIn = async(req,res,next)=>{ 
     const {email,password}=req.body
     const user =await db_service.findOne({model:userModel,filter:{email,confirmed:true }})
if(!user){
     res.status(400).json({message:"doesn't exist yad"})

}
const match=Compare({plainText:password,cipherText:user.password})
if(!match)
{
        throw new Error("wrong password or email",{cause:400});
}

const jwtid=randomUUID()

const access_token=GenerateToken({
     payload:{id:user._id,email:user.email},
     secret_key:SECRET_KEY,
     options:{
          expiresIn:60*20,
          jwtid
     }
})
//=================== 
const refresh_token=GenerateToken({
     payload:{id:user._id,email:user.email},
     secret_key:REFRESH_SECRET_KEY,
     options:{
          expiresIn:"1y",
          jwtid
     }
})
        successResponse({ res, message: "done", data: {access_token,refresh_token} })
}
//--------forget password--------------------
export const forgetPassword = async(req,res,next)=>{
     const {email}=req.body
     const user=await db_service.findOne({
          model:userModel, filter:{
               email
               ,confirmed:true

          }
     })

if(!user){
     throw new Error("user does not exist ");
}
await sendEmailOtp({email,subject:emailEnum.forgetPassword})
res.status(201).json({message:"done!,u have been send the otp use it with the reset password api"})
}
//----------------reset_password------------------
export const resetPassword = async(req,res,next)=>{
     const {email,otp,password}=req.body
     const otpValue=await get(otp_key({email,subject:emailEnum.forgetPassword }))
     if(!otpValue){
          throw new Error("otp expire")
     }
     if(!Compare({plainText:otp,cipherText:otpValue})){
          throw new Error("inValid otp")
     }
     const olduser=await db_service.findOne({
          model:userModel, filter:{
               email
               ,confirmed:true

          }
     })
     
     const user=await db_service.findOneAndUpdate({
          model:userModel, 
          filter:{
               email,
               confirmed:true

          },
          update:{
             password: await Hash({plainText:password,salt_rounds: SALT_RNDS}),
             changeCredential:new Date()
          }
     })
    if(!user){
     throw new Error("user does not exist ");
     }
await deleteKey(otp_key({email,subject:emailEnum.forgetPassword }))
res.status(201).json({message:"done"})
}
//---------view profile---------------------------
export const getProfile = async (req, res, next) => {    
     const key =`profile::${req.user._id}`
     const userExist=await get(key)
     if(userExist){
          return successResponse({res,data:userExist})
     }
     await setValue({key,value:req.user,ttl:60})
    successResponse({ res, message: "success signin", data: req.user })
}
export const shareProfile=async(req,res,next)=>{
    const {id}=req.params
    const user=await db_service.findById({
     model:userModel,
     id,
     options:{select:"-password"}
     

    })
    if(!user){
     throw new Error("user not exist yet");

    }
    user.phone = decrypt(user.phone)
    successResponse({res,data:user
    })

}
export const updateProfile = async (req, res, next) => {
  let { firstName, lastName, gender, phone } = req.body;

  const user = await db_service.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { firstName, lastName, gender, phone }, // ✅ fixed
  });

  if (!user) {
    throw new Error("user not exist yet");
  }

if(phone){
  user.phone=encrypt(phone)
}

  successResponse({ res, data: user });
};
//--------------------------------------------
export const updatePassword = async (req, res, next) => { 
let {oldPassword,newPassword,cPassword} = req.body
if(!Compare({
     plainText:oldPassword,cipherText:req.user.password
})){
     throw new Error("inValid old password");
}



let hash= await Hash({
     plainText:newPassword
})
req.user.password=hash
req.user.changeCredential = new Date()
await req.user.save()



};
export const refresh_token=async (req,res,next)=>{
     const {authorization}=req.headers

    if (!authorization){
       throw new Error("token not exist");
    }
    const [prefix,token]=authorization.split(" ")
    if(prefix!== PREFIX){
        throw new Error("invalid token prefix");
    }
    const decoded = VerifyToken({token,secret_key:REFRESH_SECRET_KEY})
if(!decoded|| !decoded?.id){
    throw new Error("inValid token")
}
    const user = await db_service.findOne({ model: userModel, filter: { _id: decoded.id } })
      
    if (!user) {
        throw new Error("user not exist", { cause: 400 });
    }
}
export const signUpWithGmail = async(req,res,next)=>{ 
     const {idToken}=req.body
     const client =new OAuth2Client();
     const ticket = await client.verifyIdToken({
          idToken,
          audience:"75936998803-jhn1i7koaq8k7l0h92611oo18muki8s0.apps.googleusercontent.com"
     });
     const payload=ticket.getPayload();
     const {email,email_verified,name,picture}=payload
     let user = await db_service.findOne({model:userModel,filter:{email}})
 
     if(!user){
          user=await db_service.create({
             model:userModel,
             data:{
               email,
               confirmed:email_verified,
               userName:name,
               profilePicture:picture,
               provider:ProviderEnum.google
             }
          })
     }
     if(user.provider==ProviderEnum.system){
       throw new Error("please log in on system only",{cause:400  })
     }
     const access_token=GenerateToken({
     payload:{id:user._id,email:user.email},
     secret_key:user.role==RoleEnum.user?SECRET_KEY:"test respones for someone else other than the user ",
     options:{
          expiresIn:60*5
     }
})
        successResponse({ res, message: "done", data: {access_token} })

}

//--------------logout----------------
export const logout =async(req,res,next)=>{
     const {flag}=req.query
     if(flag ==="all"){
     req.user.changeCredential=new Date()
     await req.user.save()
     await deleteKey(await keys(get_key({userId:req.user._id})))
     // await db_service.deleteMany({
     //      model:revokeTokenModel,filter:{userId:req.user._id}
     // }) 
     }else{
            await setValue({
               key:revoked_key({userId:req.user._id,jti:req.decoded.jti}),
               value:`${req.decoded.jti}`,
               ttl: req.decoded.exp - Math.floor(Date.now()/1000)
            })
            
           
     }
     successResponse({res})
}
//-------------------------------------

