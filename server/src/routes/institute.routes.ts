import { Router } from 'express';
import * as instituteController from '../modules/institute/institute.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { validateRequest, validateParams } from '../../middlewares/validator.middleware.js';
import { 
    instituteParamsSchema, 
    createInstituteSchema, 
    updateInstituteSchema,
    addCourseToInstituteSchema, 
    removeCourseFromInstituteParamsSchema, 
    addStudentToInstituteSchema, 
    removeStudentFromInstituteParamsSchema 
} from '../modules/institute/institute.validator.js';

export const instituteRouter = Router();

instituteRouter.post(
    "/institute/create",
    isAuthenticated,
    validateRequest(createInstituteSchema),
    instituteController.createInstitute
);

instituteRouter.put(
    "/institute/:id",
    isAuthenticated,
    validateParams(instituteParamsSchema),
    validateRequest(updateInstituteSchema),
    instituteController.updateInstitute
);

instituteRouter.delete(
    "/institute/:id",
    isAuthenticated,
    validateParams(instituteParamsSchema),
    instituteController.deleteInstitute
);

instituteRouter.get(
    "/institutes",
    isAuthenticated,
    instituteController.getAllInstitutes
);

instituteRouter.get(
    "/institute/:id",
    isAuthenticated,
    validateParams(instituteParamsSchema),
    instituteController.getInstituteById
);

instituteRouter.post(
    '/institute/:id/course', 
    isAuthenticated, 
    validateParams(instituteParamsSchema), 
    validateRequest(addCourseToInstituteSchema), 
    instituteController.addCourseToInstitute
);

instituteRouter.delete(
    '/institute/:id/course', 
    isAuthenticated, 
    validateParams(removeCourseFromInstituteParamsSchema), 
    instituteController.removeCourseFromInstitute
);

instituteRouter.post(
    '/institute/:id/student', 
    isAuthenticated, 
    validateParams(instituteParamsSchema), 
    validateRequest(addStudentToInstituteSchema), 
    instituteController.addStudentToInstitute
);

instituteRouter.delete(
    '/institute/:id/remove-course', 
    isAuthenticated, 
    validateParams(removeStudentFromInstituteParamsSchema), 
    instituteController.removeStudentFromInstitute
);