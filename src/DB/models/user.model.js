import mongoose from "mongoose"
import {RoleEnum,GenderEnum,ProviderEnum} from "../../common/enum/user.enum.js"

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLenght:23,
        trim:true

    },
    lastName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:28,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required: function(){
            return this.provider== ProviderEnum.google ? false: true
        },
        trim:true,
        minLength:6
        
    },
    role:{
        type:String,
        enum:Object.values(RoleEnum),
        default:RoleEnum.system
    },
    phone:{
        type:String,
        trim:true
    }
    ,
    age:Number,
    gender:{
        type:String,
        enum:["male","female"],
        default: GenderEnum.male
    },
    profilePicture:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true},
    },
    coverPicture:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true},
    },
   confirmed:{type:Boolean, default:false},
    provider:{
        type:String,
        enum:["System","google"],
        default:ProviderEnum.System
    },
    changeCredential:Date
},{
    timestamps:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
userSchema.virtual("userName")
  .get(function() {
    // Use a template literal to combine them without changing the original data
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(v) {
    // Split the full string into an array
    const [firstName, lastName] = v.split(" ");
    this.set({ firstName, lastName });
  });
const userModel = mongoose.models.user || mongoose.model("user",userSchema)
export default userModel