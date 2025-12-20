import { z } from "zod";

export const instituteParamsSchema = z.object({
    id: z.uuid({ message: "Invalid ID format. Must be a UUID." })
});

export const createInstituteSchema = z.object({
    name: z.string().min(1, { message: "Institute name is required" }),
});

export const updateInstituteSchema = z.object({
    data: z.object({
        name: z.string().min(1, { message: "Institute name is required" }).optional(),
    }),
});

export const addCourseToInstituteSchema = z.object({
    courseId: z.uuid({ message: "Invalid course ID format" }),
});

export const removeCourseFromInstituteParamsSchema = z.object({
    id: z.uuid({ message: "Invalid institute ID format" }),
    courseId: z.uuid({ message: "Invalid course ID format" }),
});

export const addStudentToInstituteSchema = z.object({
    studentId: z.uuid({ message: "Invalid student ID format" }),
});

export const removeStudentFromInstituteParamsSchema = z.object({
    id: z.uuid({ message: "Invalid institute ID format" }),
    studentId: z.uuid({ message: "Invalid student ID format" }),
});

export type InstituteParams = z.infer<typeof instituteParamsSchema>;
export type InstituteCreate = z.infer<typeof createInstituteSchema>;
export type InstituteUpdate = z.infer<typeof updateInstituteSchema>;
export type AddCourseToInstitute = z.infer<typeof addCourseToInstituteSchema>;
export type RemoveCourseFromInstitute = z.infer<typeof removeCourseFromInstituteParamsSchema>;
export type AddStudentToInstitute = z.infer<typeof addStudentToInstituteSchema>;
export type RemoveStudentFromInstitute = z.infer<typeof removeStudentFromInstituteParamsSchema>;