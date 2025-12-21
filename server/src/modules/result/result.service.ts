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


export const queryResults = async (filters: {
    id?: string;
    student_id?: string;
    course_id?: string;
    institute_id?: string;
    status?: string;
    academic_year?: number;
    semester?: string;
    grade?: string;
    min_percentage?: number;
    max_percentage?: number;
    min_marks?: number;
    max_marks?: number;
    exam_date_from?: string;
    exam_date_to?: string;
    offset?: number;
    limit?: number;
}) => {
    const {
        id,
        student_id,
        course_id,
        institute_id,
        status,
        academic_year,
        semester,
        grade,
        min_percentage,
        max_percentage,
        min_marks,
        max_marks,
        exam_date_from,
        exam_date_to,
        offset = 0,
        limit = 10,
    } = filters;

    const whereClause: Prisma.ResultWhereInput = {};

    if (id) whereClause.id = id;
    if (student_id) whereClause.student_id = student_id;
    if (course_id) whereClause.course_id = course_id;
    if (institute_id) whereClause.institute_id = institute_id;
    if (status) whereClause.status = status;
    if (academic_year) whereClause.academic_year = academic_year;
    if (semester) whereClause.semester = semester;
    if (grade) whereClause.grade = grade;

    if (min_percentage !== undefined || max_percentage !== undefined) {
        whereClause.percentage = {};
        if (min_percentage !== undefined) {
            whereClause.percentage.gte = new Prisma.Decimal(min_percentage);
        }
        if (max_percentage !== undefined) {
            whereClause.percentage.lte = new Prisma.Decimal(max_percentage);
        }
    }

    if (min_marks !== undefined || max_marks !== undefined) {
        whereClause.marks = {};
        if (min_marks !== undefined) {
            whereClause.marks.gte = new Prisma.Decimal(min_marks);
        }
        if (max_marks !== undefined) {
            whereClause.marks.lte = new Prisma.Decimal(max_marks);
        }
    }

    if (exam_date_from || exam_date_to) {
        whereClause.exam_date = {};
        if (exam_date_from) whereClause.exam_date.gte = exam_date_from;
        if (exam_date_to) whereClause.exam_date.lte = exam_date_to;
    }

    if (student_id) {
        const student = await prisma.student.findUnique({ 
            where: { id: student_id } 
        });
        if (!student) throw new Error('Student not found');
    }

    if (course_id) {
        const course = await prisma.course.findUnique({ 
            where: { id: course_id } 
        });
        if (!course) throw new Error('Course not found');
    }

    if (institute_id) {
        const institute = await prisma.institute.findUnique({ 
            where: { id: institute_id } 
        });
        if (!institute) throw new Error('Institute not found');
    }

    if (id) {
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
    }

    const [results, totalCount] = await prisma.$transaction([
        prisma.result.findMany({
            where: whereClause,
            skip: offset,
            take: limit,
            include: {
                student: true,
                course: true,
                institute: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        }),
        prisma.result.count({ where: whereClause }),
    ]);

    return {
        data: results,
        pagination: {
            offset,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: (offset + limit) < totalCount,
        },
    };
};