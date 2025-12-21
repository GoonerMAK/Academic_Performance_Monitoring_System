import { z } from "zod";

export const resultParamsSchema = z.object({
    id: z.uuid({ message: "Invalid ID format. Must be a UUID." })
});

export const studentParamsSchema = z.object({
    studentId: z.uuid({ message: "Invalid student ID format" })
});

export const courseParamsSchema = z.object({
    courseId: z.uuid({ message: "Invalid course ID format" })
});

export const instituteParamsSchema = z.object({
    instituteId: z.uuid({ message: "Invalid institute ID format" })
});

export const queryParamsSchema = z.object({
    id: z.uuid().optional(),
    studentId: z.uuid().optional(),
    courseId: z.uuid().optional(),
    instituteId: z.uuid().optional(),
});

export const createResultSchema = z.object({
    student_id: z.uuid({ message: "Invalid student ID format" }),
    course_id: z.uuid({ message: "Invalid course ID format" }),
    institute_id: z.uuid({ message: "Invalid institute ID format" }),
    grade: z.string().optional(),
    marks: z.number().min(0, { message: "Marks must be a positive number" }).optional(),
    percentage: z.number().min(0).max(100, { message: "Percentage must be between 0 and 100" }).optional(),
    status: z.string().optional(),
    remarks: z.string().optional(),
    exam_date: z.iso.datetime({ message: "Invalid date format" }).optional(),
    academic_year: z.number().int().positive({ message: "Academic year must be a positive integer" }).optional(),
    semester: z.string().optional(),
});

export const updateResultSchema = z.object({
    data: z.object({
        grade: z.string().optional(),
        marks: z.number().min(0, { message: "Marks must be a positive number" }).optional(),
        percentage: z.number().min(0).max(100, { message: "Percentage must be between 0 and 100" }).optional(),
        status: z.string().optional(),
        remarks: z.string().optional(),
        exam_date: z.iso.datetime({ message: "Invalid date format" }).optional(),
        academic_year: z.number().int().positive({ message: "Academic year must be a positive integer" }).optional(),
        semester: z.string().optional(),
    }),
});

export const resultQuerySchema = z.object({
    student_id: z.uuid().optional(),
    course_id: z.uuid().optional(),
    institute_id: z.uuid().optional(),
    academic_year: z.string()
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val > 0, { message: "Academic year must be a positive number" })
        .optional(),
    semester: z.string().optional(),
    status: z.string().optional(),
    grade: z.string().optional(),

    min_percentage: z.string()
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val) && val >= 0 && val <= 100)
        .optional(),
    max_percentage: z.string()
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val) && val >= 0 && val <= 100)
        .optional(),
    min_marks: z.string()
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val) && val >= 0)
        .optional(),
    max_marks: z.string()
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val) && val >= 0)
        .optional(),
    
    exam_date_from: z.iso.datetime().optional(),
    exam_date_to: z.iso.datetime().optional(),
    
    offset: z.string()
        .default('0')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 0, { message: "Offset must be a non-negative number" })
        .optional(),
    
    limit: z.string()
        .default('10')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val > 0 && val <= 100, { 
            message: "Limit must be between 1 and 100" 
        })
        .optional(),
});


export type ResultParams = z.infer<typeof resultParamsSchema>;
export type StudentParams = z.infer<typeof studentParamsSchema>;
export type CourseParams = z.infer<typeof courseParamsSchema>;
export type InstituteParams = z.infer<typeof instituteParamsSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
export type ResultCreate = z.infer<typeof createResultSchema>;
export type ResultUpdate = z.infer<typeof updateResultSchema>;
export type ResultQuery = z.infer<typeof resultQuerySchema>;