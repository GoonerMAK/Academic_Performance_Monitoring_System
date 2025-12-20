import type { Request, Response } from 'express';
import * as courseService from './course.service.js';
import type { 
    CourseParams, 
    CourseCreate, 
    CourseUpdate,
    AddStudentToCourse,
    RemoveStudentFromCourse
} from './course.validator.js';


export const createCourse = async (
    req: Request<unknown, unknown, CourseCreate, unknown>,
    res: Response
) => {
    const { name, description } = req.body;
    
    try {
        const newCourse = await courseService.createCourse(name, description);
        res.status(201).json(newCourse);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to create course' });
    }
};


export const updateCourse = async (
    req: Request<CourseParams, unknown, CourseUpdate, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const updates = req.body.data;
    
    try {
        const updatedCourse = await courseService.updateCourse(id, updates);
        res.status(200).json(updatedCourse);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update course' });
        }
    }
};


export const deleteCourse = async (
    req: Request<CourseParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const deletedCourse = await courseService.deleteCourse(id);
        res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to delete course' });
        }
    }
};


export const getAllCourses = async (
    _req: Request<unknown, unknown, unknown, unknown>,
    res: Response
) => {
    try {
        const courses = await courseService.getAllCourses();
        res.status(200).json(courses);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to fetch courses' });
    }
};


export const getCourseById = async (
    req: Request<CourseParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const course = await courseService.getCourseById(id);
        res.status(200).json(course);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to fetch course' });
        }
    }
};


export const addStudentToCourse = async (
    req: Request<CourseParams, unknown, AddStudentToCourse, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { studentId } = req.body;
    
    try {
        const result = await courseService.addStudentToCourse(id, studentId);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('already enrolled')) {
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
    const { id, studentId } = req.params;
    
    try {
        await courseService.removeStudentFromCourse(id, studentId);
        res.status(200).json({ message: 'Student removed from course successfully' });
    } catch (error: any) {
        if (error.message.includes('not enrolled')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to remove student from course' });
        }
    }
};