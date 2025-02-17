import mongoose from 'mongoose'
import dotenv from 'dotenv' 
dotenv.config()

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowecase:true,
        minlength: [3, 'Project name must be minimum 3 characters long'],
        maxlength: [15, 'Project name must be less then 15 character long']
    },
   
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    fileTree: {
        type: Object,
        default: {}
    }
})
const projectModel = mongoose.model('project', projectSchema);
export default projectModel;