import { Router } from 'express';
import * as userController from '../modules/user/user.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js'; 
import { validateRequest, validateParams } from '../../middlewares/validator.middleware.js';
import { createUserSchema, updateUserSchema, userParamsSchema } from '../modules/user/user.validator.js';

export const userRouter = Router();

userRouter.post('/user', isAuthenticated, validateRequest(createUserSchema), userController.createUser);
userRouter.put('/user/:id', isAuthenticated, validateParams(userParamsSchema), validateRequest(updateUserSchema), userController.updateUser);
userRouter.delete('/user/:id', isAuthenticated, validateParams(userParamsSchema), userController.deleteUser);
userRouter.get('/users', isAuthenticated, userController.getAllUsers);
userRouter.get('/user/:id', isAuthenticated, validateParams(userParamsSchema), userController.getUserById);

