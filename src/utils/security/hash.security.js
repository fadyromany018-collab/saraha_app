import{hashSync,compareSync} from "bcrypt"
import { SALT_RNDS } from "../../../config/config.service.js"

export const  Hash=async({plainText,salt_rounds=SALT_RNDS}={})=>{
return  hashSync(plainText, Number(salt_rounds))
}
export const Compare=({plainText,cipherText}={})=>{
    return  compareSync(plainText,cipherText)
} 