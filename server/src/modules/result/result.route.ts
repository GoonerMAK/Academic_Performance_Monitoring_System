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
    updateResultSchema,
    resultQuerySchema
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
    validateQuery(resultQuerySchema),
    resultController.queryResults
);