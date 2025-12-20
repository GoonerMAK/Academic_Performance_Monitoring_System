import type { Request, Response } from 'express';
import * as resultService from './result.service.js';
import type { 
    ResultParams,
    ResultCreate, 
    ResultUpdate,
    StudentParams,
    CourseParams,
    InstituteParams
} from './result.validator.js';


export const createResult = async (
    req: Request<unknown, unknown, ResultCreate, unknown>,
    res: Response
) => {
    const data = req.body;
    
    try {
        const newResult = await resultService.createResult(data);
        res.status(201).json(newResult);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already exists')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to create result' });
        }
    }
};


export const updateResult = async (
    req: Request<ResultParams, unknown, ResultUpdate, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const updates = req.body.data;
    
    try {
        const updatedResult = await resultService.updateResult(id, updates);
        res.status(200).json(updatedResult);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update result' });
        }
    }
};


export const deleteResult = async (
    req: Request<ResultParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const deletedResult = await resultService.deleteResult(id);
        res.status(200).json({ message: 'Result deleted successfully', result: deletedResult });
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to delete result' });
        }
    }
};


export const getAllResults = async (
    _req: Request<unknown, unknown, unknown, unknown>,
    res: Response
) => {
    try {
        const results = await resultService.getAllResults();
        res.status(200).json(results);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to fetch results' });
    }
};


export const getResultById = async (
    req: Request<ResultParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const result = await resultService.getResultById(id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch result' });
        }
    }
};


export const getResultsByStudent = async (
    req: Request<StudentParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { studentId } = req.params;
    
    try {
        const results = await resultService.getResultsByStudent(studentId);
        res.status(200).json(results);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch results' });
        }
    }
};


export const getResultsByCourse = async (
    req: Request<CourseParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { courseId } = req.params;
    
    try {
        const results = await resultService.getResultsByCourse(courseId);
        res.status(200).json(results);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch results' });
        }
    }
};


export const getResultsByInstitute = async (
    req: Request<InstituteParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { instituteId } = req.params;
    
    try {
        const results = await resultService.getResultsByInstitute(instituteId);
        res.status(200).json(results);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch results' });
        }
    }
};