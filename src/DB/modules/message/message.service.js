import userModel from "../../models/user.model.js"
import messageModel from "../../models/message.model.js"
import * as db_service from "../../../DB/db.service.js"
import {successResponse} from "../../../utils/response.success.js"

export const sendMessage=async(req,res,next)=>{
    const {content,userId}=req.body
    const user = await db_service.findById({
        model:userModel,
        id:userId
    })
    if(!user){
        throw new Error("user not exist")
    }
    let arr=[]
    if(req.files.length){
        for(const element of req.files){
            arr.push(element.path)
        }
    }
    const message=await db_service.create({
        model:messageModel,
        data:{
            content,
            userId:user._id,
            attachments:arr
        }
    })
    successResponse({res,status:201,data:message})
}

export const getMessage=async(req,res,next)=>{
    const {messageId}=req.params
    const message = await db_service.findOne({
        model:messageModel,
        filter:{
            _id:messageId,
            userId:req.user.id 
        }
    })

    successResponse({res,status:201,data:message})
}