import {Router} from"express"
import * as U from "./user.service.js"
import { authentication } from "../../common/middleware/authentication.js"
import { authorization } from "../../common/middleware/authorization.js"
import {RoleEnum} from "../../common/enum/user.enum.js"
import { validation } from "../../common/middleware/validation.js"
import * as UV from "../modules/user.validation.js"
import { multer_local ,multer_host} from "../../common/middleware/multer.js"
import {multer_enum} from "../../common/enum/multer_enum.js"
import messageRounter from "../../DB/modules/message/message.controller.js"
const userRouter = Router({caseSensitive:true,strict:true})

// userRouter.post("/signup",validation(UV.signUpSchema),U.signUp)
// userRouter.post("/signup/gmail",U.signUpWithGmail)
// userRouter.post("/signin",validation(UV.signInSchema),U.signIn)
// userRouter.get("/profile",authentication,authorization([RoleEnum.admin]),U.getProfile)
// export default userRouter


userRouter.use("/:userId/messages",messageRounter)
userRouter.post("/signup",multer_host().
single("attachment"),validation(UV.signUpSchema),U.signUp)
userRouter.post("/signup/gmail",U.signUpWithGmail)
userRouter.post("/signin",validation(UV.signInSchema),U.signIn)
userRouter.get("/profile",authentication,U.getProfile)
userRouter.get("/share-profile/:id",U.shareProfile)
userRouter.patch("/update-profile",validation(UV.updateProfileSchema),authentication,U.updateProfile)
userRouter.patch("/update-password",validation(UV.updatePasswordSchema),authentication,U.updatePassword)
userRouter.post("/logout",authentication,U.logout)
userRouter.patch("/confirm-email",validation(UV.confirmEmailSchema),U.confirmEmail)
userRouter.post("/resend-otp",//validation(UV.confirmEmailSchema),
    U.resendOtp) 
userRouter.patch("/forget-password",validation(UV.reSendOtpSchema),U.forgetPassword)
userRouter.patch("/reset-password",validation(UV.resetPasswordSchema),U.resetPassword)
export default userRouter