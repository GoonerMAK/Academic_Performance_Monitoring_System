import { z } from "zod";

export const studentParamsSchema = z.object({
    id: z.uuid({ message: "Invalid ID format. Must be a UUID." }),
    email: z.email({ message: "Invalid email format" })
});

export const createStudentSchema = z.object({
    name: z.string().min(1, { message: "Student name is required" }),
    email: z.email({ message: "Invalid email format" }),
    student_id: z.string().optional(),
    age: z.number().int().positive({ message: "Age must be a positive integer" }).optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
});

export const updateStudentSchema = z.object({
    data: z.object({
        name: z.string().min(1, { message: "Student name is required" }).optional(),
        email: z.email({ message: "Invalid email format" }).optional(),
        student_id: z.string().optional(),
        age: z.number().int().positive({ message: "Age must be a positive integer" }).optional(),
        gender: z.string().optional(),
        nationality: z.string().optional(),
    }),
});

export const addStudentToCourseSchema = z.object({
    courseId: z.uuid({ message: "Invalid course ID format" }),
});

export const removeStudentFromCourseParamsSchema = z.object({
    id: z.uuid({ message: "Invalid student ID format" }),
    courseId: z.uuid({ message: "Invalid course ID format" }),
});

export const addStudentToInstituteSchema = z.object({
    instituteId: z.uuid({ message: "Invalid institute ID format" }),
});

export const removeStudentFromInstituteParamsSchema = z.object({
    id: z.uuid({ message: "Invalid student ID format" }),
    instituteId: z.uuid({ message: "Invalid institute ID format" }),
});

export type StudentParams = z.infer<typeof studentParamsSchema>;
export type StudentCreate = z.infer<typeof createStudentSchema>;
export type StudentUpdate = z.infer<typeof updateStudentSchema>;
export type AddStudentToCourse = z.infer<typeof addStudentToCourseSchema>;
export type RemoveStudentFromCourse = z.infer<typeof removeStudentFromCourseParamsSchema>;
export type AddStudentToInstitute = z.infer<typeof addStudentToInstituteSchema>;
export type RemoveStudentFromInstitute = z.infer<typeof removeStudentFromInstituteParamsSchema>;