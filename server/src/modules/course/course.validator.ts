import { z } from "zod";

export const courseParamsSchema = z.object({
    id: z.uuid({ message: "Invalid ID format. Must be a UUID." })
});

export const createCourseSchema = z.object({
    name: z.string().min(1, { message: "Course name is required" }),
    description: z.string().optional(),
});

export const updateCourseSchema = z.object({
    data: z.object({
        name: z.string().min(1, { message: "Course name is required" }).optional(),
        description: z.string().optional(),
    }),
});

export const addStudentToCourseSchema = z.object({
    studentId: z.uuid({ message: "Invalid student ID format" }),
});

export const removeStudentFromCourseParamsSchema = z.object({
    id: z.uuid({ message: "Invalid course ID format" }),
    studentId: z.uuid({ message: "Invalid student ID format" }),
});

export type CourseParams = z.infer<typeof courseParamsSchema>;
export type CourseCreate = z.infer<typeof createCourseSchema>;
export type CourseUpdate = z.infer<typeof updateCourseSchema>;
export type AddStudentToCourse = z.infer<typeof addStudentToCourseSchema>;
export type RemoveStudentFromCourse = z.infer<typeof removeStudentFromCourseParamsSchema>;