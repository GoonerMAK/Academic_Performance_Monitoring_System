import { Router } from 'express';
import * as courseController from './course.controller.js';
import { isAuthenticated } from '../../../middlewares/auth.middleware.js';
import { validateRequest, validateParams } from '../../../middlewares/validator.middleware.js';
import { 
    courseParamsSchema, 
    createCourseSchema, 
    updateCourseSchema,
    addStudentToCourseSchema, 
    removeStudentFromCourseParamsSchema 
} from './course.validator.js';

export const courseRouter = Router();

courseRouter.post(
    "/course/create",
    isAuthenticated,
    validateRequest(createCourseSchema),
    courseController.createCourse
);

courseRouter.put(
    "/course/:id",
    isAuthenticated,
    validateParams(courseParamsSchema),
    validateRequest(updateCourseSchema),
    courseController.updateCourse
);

courseRouter.delete(
    "/course/:id",
    isAuthenticated,
    validateParams(courseParamsSchema),
    courseController.deleteCourse
);

courseRouter.get(
    "/courses",
    isAuthenticated,
    courseController.getAllCourses
);

courseRouter.get(
    "/course/:id",
    isAuthenticated,
    validateParams(courseParamsSchema),
    courseController.getCourseById
);

courseRouter.post(
    '/course/:id/student', 
    isAuthenticated, 
    validateParams(courseParamsSchema), 
    validateRequest(addStudentToCourseSchema), 
    courseController.addStudentToCourse
);

courseRouter.delete(
    '/course/:id/student/:studentId', 
    isAuthenticated, 
    validateParams(removeStudentFromCourseParamsSchema), 
    courseController.removeStudentFromCourse
);