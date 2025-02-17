import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//userSchema->user
const user=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[6,'email must be minimum 6 characters long'],
        maxlength:[15,'email must be less then 15 character long']
    },
    password:{
        type:String,
        select:false,
        required:true

    }
})

user.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}

user.methods.isValidPassword=async function (password){
    return await bcrypt.compare(password,this.password);
}

user.methods.generateJWT=function(){
    return  jwt . sign({email:this.email},process.env.JWT_SECRET,{ expiresIn: "24h" });
}

const UserModel=mongoose.model('user',user);
export default UserModel;