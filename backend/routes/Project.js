import * as projectController from '../controllers/Project.js';
import * as authMiddlerwares from '../middlewares/auth.js';
import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post('/createProject',
             authMiddlerwares.authMiddleware,[body('name').isString().withMessage('Name is required')],
             projectController.createProject);

router.get('/getAllProjects',
                authMiddlerwares.authMiddleware,  projectController.getAllProjects); 
                
router.post('/addUserToProject',
                 authMiddlerwares.authMiddleware,
                 body('projectId').isString().withMessage('Project id is required'),
                 body('users').isArray({min:1}).withMessage('Users should be an array').bail().
                 custom((users)=>users.every(user=>typeof user==='string')).withMessage('Users should be an array of string'
                 ),projectController.addUserToProject);    
                     
router.get('/getProjectById/:projectId',authMiddlerwares.authMiddleware,projectController.getProjectById);
          
router.put('/updateFileTree',
    authMiddlerwares.authMiddleware,
    body('projectId').isString().withMessage('Project id is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree);

 export default router;