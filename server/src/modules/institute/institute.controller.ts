import type { Request, Response } from 'express';
import * as instituteService from './institute.service.js';
import type { 
    InstituteParams, 
    InstituteCreate, 
    InstituteUpdate,
    AddCourseToInstitute,
    RemoveCourseFromInstitute,
    AddStudentToInstitute,
    RemoveStudentFromInstitute
} from './institute.validator.js';
import type { PaginationQuery } from '../pagination/pagination.validator.js';


export const createInstitute = async (
    req: Request<unknown, unknown, InstituteCreate, unknown>,
    res: Response
) => {
    const { name } = req.body;
    
    try {
        const newInstitute = await instituteService.createInstitute(name);
        res.status(201).json(newInstitute);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to create institute' });
    }
};


export const updateInstitute = async (
    req: Request<InstituteParams, unknown, InstituteUpdate, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const updates = req.body.data;
    
    try {
        const updatedInstitute = await instituteService.updateInstitute(id, updates);
        res.status(200).json(updatedInstitute);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update institute' });
        }
    }
};


export const deleteInstitute = async (
    req: Request<InstituteParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const deletedInstitute = await instituteService.deleteInstitute(id);
        res.status(200).json({ message: 'Institute deleted successfully', institute: deletedInstitute });
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to delete institute' });
        }
    }
};


export const getAllInstitutes = async (
    req: Request<unknown, unknown, unknown, PaginationQuery>,
    res: Response
) => {
    try {
        const { offset, limit } = req.query;
        const institutes = await instituteService.getAllInstitutes(Number(offset), Number(limit));
        res.status(200).json(institutes);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to fetch institutes' });
    }
};


export const getInstituteById = async (
    req: Request<InstituteParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const institute = await instituteService.getInstituteById(id);
        res.status(200).json(institute);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch institute' });
        }
    }
};


export const addCourseToInstitute = async (
    req: Request<InstituteParams, unknown, AddCourseToInstitute, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { courseId } = req.body;
    
    try {
        const result = await instituteService.addCourseToInstitute(id, courseId);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already added')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to add course to institute' });
        }
    }
};


export const removeCourseFromInstitute = async (
    req: Request<RemoveCourseFromInstitute, unknown, unknown, unknown>,
    res: Response
) => {
    const { id, courseId } = req.params;
    
    try {
        await instituteService.removeCourseFromInstitute(id, courseId);
        res.status(200).json({ message: 'Course removed from institute successfully' });
    } catch (error: any) {
        if (error.message.includes('not associated')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to remove course from institute' });
        }
    }
};


export const addStudentToInstitute = async (
    req: Request<InstituteParams, unknown, AddStudentToInstitute, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { studentId } = req.body;
    
    try {
        const result = await instituteService.addStudentToInstitute(id, studentId);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already associated')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to add student to institute' });
        }
    }
};


export const removeStudentFromInstitute = async (
    req: Request<RemoveStudentFromInstitute, unknown, unknown, unknown>,
    res: Response
) => {
    const { id, studentId } = req.params;
    
    try {
        await instituteService.removeStudentFromInstitute(id, studentId);
        res.status(200).json({ message: 'Student removed from institute successfully' });
    } catch (error: any) {
        if (error.message.includes('not associated')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to remove student from institute' });
        }
    }
};