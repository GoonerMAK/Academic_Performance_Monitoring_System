import prisma from "../../../utils/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";


export const createResult = async (data: {
    student_id: string;
    course_id: string;
    institute_id: string;
    grade?: string;
    marks?: number;
    percentage?: number;
    status?: string;
    remarks?: string;
    exam_date?: string;
    academic_year?: number;
    semester?: string;
}) => {
    const student = await prisma.student.findUnique({ 
        where: { id: data.student_id } 
    });
    if (!student) throw new Error('Student not found');

    const course = await prisma.course.findUnique({ 
        where: { id: data.course_id } 
    });
    if (!course) throw new Error('Course not found');

    const institute = await prisma.institute.findUnique({ 
        where: { id: data.institute_id } 
    });
    if (!institute) throw new Error('Institute not found');

    // Check if result already exists for this combination
    const existing = await prisma.result.findUnique({
        where: {
            student_id_course_id_institute_id: {
                student_id: data.student_id,
                course_id: data.course_id,
                institute_id: data.institute_id,
            },
        },
    });

    if (existing) {
        throw new Error('Result already exists for this student-course-institute combination');
    }

    return await prisma.result.create({
        data: {
            student_id: data.student_id,
            course_id: data.course_id,
            institute_id: data.institute_id,
            grade: data.grade,
            marks: data.marks ? new Prisma.Decimal(data.marks) : undefined,
            percentage: data.percentage ? new Prisma.Decimal(data.percentage) : undefined,
            status: data.status,
            remarks: data.remarks,
            exam_date: data.exam_date,
            academic_year: data.academic_year,
            semester: data.semester,
        },
        include: {
            student: true,
            course: true,
            institute: true,
        },
    });
};


export const updateResult = async (
    id: string,
    updates: {
        grade?: string;
        marks?: number;
        percentage?: number;
        status?: string;
        remarks?: string;
        exam_date?: string;
        academic_year?: number;
        semester?: string;
    }
) => {
    const existingResult = await prisma.result.findUnique({
        where: { id },
    });

    if (!existingResult) throw new Error(`Result with id ${id} not found`);

    return await prisma.result.update({
        where: { id },
        data: {
            grade: updates.grade,
            marks: updates.marks !== undefined ? new Prisma.Decimal(updates.marks) : undefined,
            percentage: updates.percentage !== undefined ? new Prisma.Decimal(updates.percentage) : undefined,
            status: updates.status,
            remarks: updates.remarks,
            exam_date: updates.exam_date,
            academic_year: updates.academic_year,
            semester: updates.semester,
        },
        include: {
            student: true,
            course: true,
            institute: true,
        },
    });
};


export const deleteResult = async (id: string) => {
    const result = await prisma.result.findUnique({ where: { id } });
    if (!result) throw new Error('Result not found');

    return await prisma.result.delete({ where: { id } });
};
    

export const getAllResults = async (offset: number, limit: number) => {
    const [results, totalCount] = await prisma.$transaction([
      prisma.result.findMany({
        skip: offset,
        take: limit,
        include: {
            student: true,
            course: true,
            institute: true,
        },
      }),
      prisma.result.count(),
    ]);

    const paginatedResults = {
        data: results,
        pagination: {
            offset,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: (offset + limit) < totalCount,
        }
    };

    return paginatedResults;
};


export const getResultById = async (id: string) => {
    const result = await prisma.result.findUnique({
        where: { id },
        include: {
            student: true,
            course: true,
            institute: true,
        },
    });

    if (!result) throw new Error(`Result with id ${id} not found`);

    return result;
};


export const getResultsByStudent = async (studentId: string) => {
    const student = await prisma.student.findUnique({ 
        where: { id: studentId } 
    });
    if (!student) throw new Error('Student not found');

    return await prisma.result.findMany({
        where: { student_id: studentId },
        include: {
            student: true,
            course: true,
            institute: true,
        },
    });
};


export const getResultsByCourse = async (courseId: string) => {
    const course = await prisma.course.findUnique({ 
        where: { id: courseId } 
    });
    if (!course) throw new Error('Course not found');

    return await prisma.result.findMany({
        where: { course_id: courseId },
        include: {
            student: true,
            course: true,
            institute: true,
        },
    });
};


export const getResultsByInstitute = async (instituteId: string) => {
    const institute = await prisma.institute.findUnique({ 
        where: { id: instituteId } 
    });
    if (!institute) throw new Error('Institute not found');

    return await prisma.result.findMany({
        where: { institute_id: instituteId },
        include: {
            student: true,
            course: true,
            institute: true,
        },
    });
};