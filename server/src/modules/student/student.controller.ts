import type { Request, Response } from 'express';
import * as studentService from './student.service.js';
import type { 
    StudentParams, 
    StudentCreate, 
    StudentUpdate,
    AddStudentToCourse,
    RemoveStudentFromCourse,
    AddStudentToInstitute,
    RemoveStudentFromInstitute
} from './student.validator.js';
import type { PaginationQuery } from '../pagination/pagination.validator.js';


export const createStudent = async (
    req: Request<unknown, unknown, StudentCreate, unknown>,
    res: Response
) => {
    const data = req.body;
    
    try {
        const newStudent = await studentService.createStudent(data);
        res.status(201).json(newStudent);
    } catch (error: any) {
        if (error.message.includes('already exists')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to create student' });
        }
    }
};


export const updateStudent = async (
    req: Request<StudentParams, unknown, StudentUpdate, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const updates = req.body.data;
    
    try {
        const updatedStudent = await studentService.updateStudent(id, updates);
        res.status(200).json(updatedStudent);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already in use')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update student' });
        }
    }
};


export const deleteStudent = async (
    req: Request<StudentParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const deletedStudent = await studentService.deleteStudent(id);
        res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to delete student' });
        }
    }
};


export const getAllStudents = async (
    req: Request<unknown, unknown, unknown, PaginationQuery>,
    res: Response
) => {
    try {
        const { offset, limit } = req.query;
        const students = await studentService.getAllStudents(Number(offset), Number(limit));
        res.status(200).json(students);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to fetch students' });
    }
};


export const getStudentByEmail = async (
    req: Request<StudentParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { email } = req.params;
    
    try {
        const student = await studentService.getStudentByEmail(email);
        res.status(200).json(student);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch student' });
        }
    }
};


export const addStudentToCourse = async (
    req: Request<StudentParams, unknown, AddStudentToCourse, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { courseId } = req.body;
    
    try {
        const result = await studentService.addStudentToCourse(id, courseId);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already added')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to add student to course' });
        }
    }
};


export const removeStudentFromCourse = async (
    req: Request<RemoveStudentFromCourse, unknown, unknown, unknown>,
    res: Response
) => {
    const { id, courseId } = req.params;
    
    try {
        await studentService.removeStudentFromCourse(id, courseId);
        res.status(200).json({ message: 'Student removed from course successfully' });
    } catch (error: any) {
        if (error.message.includes('not added')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to remove student from course' });
        }
    }
};


export const addStudentToInstitute = async (
    req: Request<StudentParams, unknown, AddStudentToInstitute, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { instituteId } = req.body;
    
    try {
        const result = await studentService.addStudentToInstitute(id, instituteId);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already added')) {
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
    const { id, instituteId } = req.params;
    
    try {
        await studentService.removeStudentFromInstitute(id, instituteId);
        res.status(200).json({ message: 'Student removed from institute successfully' });
    } catch (error: any) {
        if (error.message.includes('not associated')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to remove student from institute' });
        }
    }
};