import UserModel from "../models/User.js";

export const createUser=async({
    email,password
})=>{
    if(!email || ! password){
        throw new Error('email and password is required');
    }

    const hashedPassword=await UserModel.hashPassword(password);

    const UserService=await UserModel.create({
        email,
        password:hashedPassword
    });
    return UserService;
}

export const getAllUsers=async(userId)=>{
   const users=await UserModel.find({_id:{$ne: userId}});
   return users;
}