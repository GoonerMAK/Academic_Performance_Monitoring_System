import { Router } from 'express';
import * as resultController from './result.controller.js';
import { isAuthenticated } from '../../../middlewares/auth.middleware.js';
import { validateRequest, validateParams, validateQuery } from '../../../middlewares/validator.middleware.js';
import { 
    resultParamsSchema,
    studentParamsSchema,
    courseParamsSchema,
    instituteParamsSchema,
    createResultSchema, 
    updateResultSchema
} from './result.validator.js';
import { paginationQuerySchema } from '../pagination/pagination.validator.js';

export const resultRouter = Router();

resultRouter.post(
    "/result/create",
    isAuthenticated,
    validateRequest(createResultSchema),
    resultController.createResult
);

resultRouter.put(
    "/result/:id",
    isAuthenticated,
    validateParams(resultParamsSchema),
    validateRequest(updateResultSchema),
    resultController.updateResult
);

resultRouter.delete(
    "/result/:id",
    isAuthenticated,
    validateParams(resultParamsSchema),
    resultController.deleteResult
);

resultRouter.get(
    "/results",
    isAuthenticated,
    validateQuery(paginationQuerySchema),
    resultController.getAllResults
);

resultRouter.get(
    "/result/:id",
    isAuthenticated,
    validateParams(resultParamsSchema),
    resultController.getResultById
);

resultRouter.get(
    "/results/student/:studentId",
    isAuthenticated,
    validateParams(studentParamsSchema),
    resultController.getResultsByStudent
);

resultRouter.get(
    "/results/course/:courseId",
    isAuthenticated,
    validateParams(courseParamsSchema),
    resultController.getResultsByCourse
);

resultRouter.get(
    "/results/institute/:instituteId",
    isAuthenticated,
    validateParams(instituteParamsSchema),
    resultController.getResultsByInstitute
);