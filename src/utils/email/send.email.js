import  nodemailer from "nodemailer";
import {nodemailer_Email,nodemailer_Pass} from "../../../config/config.service.js"
import { randomInt } from 'crypto';

export const generateOtp = () => randomInt(100000, 1000000);

export const sendEmail =async({to,subject,html,attachments})=>{
const transporter = nodemailer.createTransport({
  service:"gmail", // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: nodemailer_Email,
    pass: nodemailer_Pass,
  },
});


  const info = await transporter.sendMail({
    from: `"Fady_Romany" <${nodemailer_Email}>`, // sender address
    to, // list of recipients
    subject: subject || "Hello", // subject line
    html:html||"<b>Hello world~!</b>", // H TML body
     attachments: attachments || []
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info.accepted.length>0 ? true:false;

}
