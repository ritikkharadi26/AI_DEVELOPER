import { Router } from "express";
import * as userController from "../controllers/User.js";
import {body} from "express-validator";
import * as auth from "../middlewares/auth.js"
const router=Router();

router.post('/register',body('email').isEmail().withMessage('email must be valid')
                       ,body('password').isLength({min:3}).withMessage('password must be 3 character long')
                       ,userController.createUserController
                        );
                        
router.post('/login',  body('email').isEmail().withMessage('Email must be a valid email address'),
                       body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
                       userController.loginController);

router.get('/profile', auth.authMiddleware,
                       userController.profileController);
                       
router.get('/logout', auth.authMiddleware,
                       userController.logoutController);

router.get('/allUsers', auth.authMiddleware,
                        userController.getAllUsersController);

export default router;                       