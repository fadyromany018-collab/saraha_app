 import dotenv from "dotenv"
import { resolve } from 'path';
const NODE_ENV=process.env.NODE_ENV; 
let envPaths={
    development:".env.development",
    production:".env.production"
}
dotenv.config({path:resolve(`config/${envPaths[NODE_ENV]}`)})

export const Port = process.env.PORT 
export const SALT_RNDS=process.env.SALT_ROUNDS
export const DB_URI= process.env.DB_URI
export const SECRET_KEY=process.env.SECRET_KEY 
export const REFRESH_SECRET_KEY=process.env.REFRESH_SECRET_KEY
export const PREFIX=process.env.PREFIX
export const REDIS_URL=process.env.REDIS_URL
export const nodemailer_Email=process.env.nodemailer_Email
export const nodemailer_Pass=process.env.nodemailer_Pass
export const WHITE_LIST=process.env.WHITE_LIST?.split(",")||[]
export const DB_URI_ONLINE=process.env.DB_URI_ONLINE