
import { mongoose } from "mongoose";
import projectModel from "../models/project.js";

export const createProject = async ({name,userId})=>{
    if(!name){
        throw new Error('Project name is required')
    }
    if(!userId){
        throw new Error('User id is required')
    }
    let project;
    try{
    project=await projectModel.create({name,users:[userId]});
    }
    catch(error){
        if(errorcode===11000){
            throw new Error('Project name already exists')
        }
        throw error;
    }
    return project;
}

export const addUsers=async({projectId,users,userId})=>{
    if(!projectId){
        throw new Error('Project id is required')
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid project id')
    }
    if(!userId){
        throw new Error('User id is required')
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('Invalid user id')
    }
    if(!Array.isArray(users) ){
        throw new Error('Users should be an array')
    }

    if(users.some(user=>!mongoose.Types.ObjectId.isValid(user))){
        throw new Error('Invalid user id')
    }

    const project=await projectModel.findOne({_id:projectId,users:userId});
    console.log(project);
    if(!project){
        throw new Error('Project not found')
    }       
    const updatedProject=await projectModel.findOneAndUpdate({_id:projectId},{
        $addToSet:{users:{$each:users}}
    },{new:true});


    return updatedProject;
}


export const getProjectById=async({projectId})=>{
    if(!projectId){
        throw new Error('Project id is required')
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid project id')
    }
    const project=await projectModel.findById(projectId).populate('users');
    if(!project){
        throw new Error('Project not found')
    }
    return project;
}

export const updateFileTree=async({projectId,fileTree})=>{
    if(!projectId){
        throw new Error('Project id is required')
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid project id')
    }
    if(!fileTree){
        throw new Error('File tree is required')
    }
    
    const project=await projectModel.findByIdAndUpdate(projectId,{fileTree},{new:true});
    return project;
}