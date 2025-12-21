import { Router } from 'express';
import * as userController from './user.controller.js';
import { isAuthenticated } from '../../../middlewares/auth.middleware.js'; 
import { validateRequest, validateParams, validateQuery } from '../../../middlewares/validator.middleware.js';
import { createUserSchema, updateUserSchema, userParamsSchema } from './user.validator.js';
import { paginationQuerySchema } from '../pagination/pagination.validator.js';

export const userRouter = Router();

userRouter.post('/user', isAuthenticated, validateRequest(createUserSchema), userController.createUser);
userRouter.put('/user/:id', isAuthenticated, validateParams(userParamsSchema), validateRequest(updateUserSchema), userController.updateUser);
userRouter.delete('/user/:id', isAuthenticated, validateParams(userParamsSchema), userController.deleteUser);
userRouter.get('/users', isAuthenticated, validateQuery(paginationQuerySchema), userController.getAllUsers);
userRouter.get('/user/:id', isAuthenticated, validateParams(userParamsSchema), userController.getUserById);

