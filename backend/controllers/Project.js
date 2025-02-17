import UserModel from "../models/User.js";
import projectModel from "../models/project.js";
import * as projectService from "../services/project.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
    const errors=validationResult(req);;
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {name}=req.body;
        const loggedId=await UserModel.findOne({email:req.user.email});
        const userId=loggedId._id;
        const newProject=await projectService.createProject({name,userId});
        res.status(201).json(newProject);  

    }
    catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const loggedId = await UserModel.findOne({ email: req.user.email });
        const userId = loggedId._id;
        const projects = await projectModel.find({ users: userId });
        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

export const addUserToProject=async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    try{
        const {projectId,users}=req.body;
        const loggedId=await UserModel.findOne({email:req.user.email});
        const userId=loggedId._id;
        const updatedProject=await projectService.addUsers({projectId,users,userId});
        res.status(200).json(updatedProject);
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}

export const getProjectById=async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    try{
        const {projectId}=req.params;
        const project=await projectService.getProjectById({projectId});
        res.status(200).json(project);
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}

export const updateFileTree=async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    try{
       const {projectId,fileTree}=req.body;
       const Project=await projectService.updateFileTree({projectId,fileTree});
       res.status(200).json(Project);
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}