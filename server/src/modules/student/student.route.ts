import { Router } from 'express';
import * as studentController from './student.controller.js';
import { isAuthenticated } from '../../../middlewares/auth.middleware.js';
import { validateRequest, validateParams } from '../../../middlewares/validator.middleware.js';
import { 
    studentParamsSchema, 
    createStudentSchema, 
    updateStudentSchema,
    addStudentToCourseSchema, 
    removeStudentFromCourseParamsSchema, 
    addStudentToInstituteSchema, 
    removeStudentFromInstituteParamsSchema 
} from './student.validator.js';

export const studentRouter = Router();

studentRouter.post(
    "/student/create",
    isAuthenticated,
    validateRequest(createStudentSchema),
    studentController.createStudent
);

studentRouter.put(
    "/student/:id",
    isAuthenticated,
    validateParams(studentParamsSchema),
    validateRequest(updateStudentSchema),
    studentController.updateStudent
);

studentRouter.delete(
    "/student/:id",
    isAuthenticated,
    validateParams(studentParamsSchema),
    studentController.deleteStudent
);

studentRouter.get(
    "/students",
    isAuthenticated,
    studentController.getAllStudents
);

studentRouter.get(
    "/student/:email",
    isAuthenticated,
    validateParams(studentParamsSchema),
    studentController.getStudentByEmail
);

studentRouter.post(
    '/student/:id/course', 
    isAuthenticated, 
    validateParams(studentParamsSchema), 
    validateRequest(addStudentToCourseSchema), 
    studentController.addStudentToCourse
);

studentRouter.delete(
    '/student/:id/course/:courseId', 
    isAuthenticated, 
    validateParams(removeStudentFromCourseParamsSchema), 
    studentController.removeStudentFromCourse
);

studentRouter.post(
    '/student/:id/institute', 
    isAuthenticated, 
    validateParams(studentParamsSchema), 
    validateRequest(addStudentToInstituteSchema), 
    studentController.addStudentToInstitute
);

studentRouter.delete(
    '/student/:id/institute/:instituteId', 
    isAuthenticated, 
    validateParams(removeStudentFromInstituteParamsSchema), 
    studentController.removeStudentFromInstitute
);