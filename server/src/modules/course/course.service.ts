import prisma from "../../../utils/prisma.js";


export const createCourse = async (name: string, description?: string) => {
    return await prisma.course.create({
        data: { name, description },
    });
};


export const updateCourse = async (
    id: string,
    updates: { name?: string; description?: string }
) => {
    const existingCourse = await prisma.course.findUnique({
        where: { id },
    });

    if (!existingCourse) throw new Error(`Course with id ${id} not found`);

    // Check if the new name is already in use by another course
    if (updates.name) {
        const nameExists = await prisma.course.findFirst({
            where: {
                name: updates.name,
                NOT: { id },
            },
        });

        if (nameExists) {
            throw new Error(`Course name "${updates.name}" is already in use`);
        }
    }

    return await prisma.course.update({
        where: { id },
        data: updates,
    });
};


export const deleteCourse = async (id: string) => {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw new Error('Course not found');

    return await prisma.course.delete({ where: { id } });
};


export const getAllCourses = async (offset: number, limit: number) => {
    const [courses, totalCount] = await prisma.$transaction([
      prisma.course.findMany({
        skip: offset,
        take: limit,
      }),
      prisma.course.count(),
    ]);

    const  paginatedCourses = {
        data: courses,
        pagination: {
            offset,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: (offset + limit) < totalCount,
        }
    };

    return paginatedCourses;
};


export const getCourseById = async (id: string) => {
    const course = await prisma.course.findUnique({
        where: { id },
    });

    if (!course) throw new Error(`Course with id ${id} not found`);

    return course;
};


export const addStudentToCourse = async (courseId: string, studentId: string) => {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error('Student not found');

    const existing = await prisma.studentCourse.findUnique({
        where: {
            student_id_course_id: {
                student_id: studentId,
                course_id: courseId,
            },
        },
    });

    if (existing) {
        throw new Error('Student already enrolled in this course');
    }

    return await prisma.studentCourse.create({
        data: {
            student_id: studentId,
            course_id: courseId,
        },
        include: {
            student: true,
            course: true,
        },
    });
};


export const removeStudentFromCourse = async (courseId: string, studentId: string) => {
    const existing = await prisma.studentCourse.findUnique({
        where: {
            student_id_course_id: {
                student_id: studentId,
                course_id: courseId,
            },
        },
    });

    if (!existing) {
        throw new Error('Student not enrolled in this course');
    }

    return await prisma.studentCourse.delete({
        where: {
            student_id_course_id: {
                student_id: studentId,
                course_id: courseId,
            },
        },
    });
};