import {Port} from "../config/config.service.js"
import express from 'express'
import checkConnectionDB from'./DB/connectionDB.js'
import userRouter from "./DB/modules/user.controller.js"
import {connectRedis} from "././DB/redis/redis.connect.js"
import messageRouter from "./DB/modules/message/message.controller.js"
import cors from 'cors';
import helmet from "helmet";
import {rateLimit} from 'express-rate-limit';
import {WHITE_LIST} from "../config/config.service.js";
const app = express()
const port = Port
const bootstrap=async ()=>{

const limiter=rateLimit({
    windowMs: 60 * 5 * 1000,
    limit:3,
    message:"game over",
    statusCode:"400",
    requestPropertyName:"rate_limit",
    // handler:(req,res,next)=>{
    //     return res.status(401).json({message:"game over"
    //     })
    // }
})


const corsOptions={
    origin:function(origin,callback){
        if([...WHITE_LIST,undefined].includes(origin)){
               callback(null,true)
        }else{
            callback( new Error ("not allowed by the cors"))
        }
    }
}

app.use(cors(corsOptions),
helmet(),
limiter,
express.json())


app.get ('/',(req,res)=>res.send('Hello world'))
checkConnectionDB()
connectRedis()

app.use("/uploads",express.static("uploads"))
app.use('/users',userRouter)
//---------message-----------------
app.use('/messages',messageRouter)
//---------------------------------
app.use("{/*demo}",(req,res,next)=>{
res.status(404).json({message:`Url ${req.orginalUrl} not Found.....`})
})
app.use((err,req,res,next)=>{

    res.status(500).json({message:err.message,stack:err.stack})
})

app.listen(port,()=> console.log(`Example app listening on port ${port}`))
}
export default bootstrap
 