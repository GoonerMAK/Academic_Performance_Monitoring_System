import prisma from "../../../utils/prisma.js";


export const createInstitute = async (name: string) => {
    return await prisma.institute.create({
        data: { name },
    });
};


export const updateInstitute = async (
    id: string,
    updates: { name?: string }
) => {
    const existingInstitute = await prisma.institute.findUnique({
        where: { id },
    });

    if (!existingInstitute) throw new Error(`Institute with id ${id} not found`);

    // Check if the new name is already in use by another institute
    if (updates.name) {
        const nameExists = await prisma.institute.findFirst({
            where: {
                name: updates.name,
                NOT: { id }, 
            },
        });

        if (nameExists) {
            throw new Error(`Institute name "${updates.name}" is already in use`);
        }
    }

    return await prisma.institute.update({
        where: { id },
        data: updates,
    });
};


export const deleteInstitute = async (id: string) => {
    const institute = await prisma.institute.findUnique({ where: { id } });
    if (!institute) throw new Error('Institute not found');

    return await prisma.institute.delete({ where: { id } });
};


export const getAllInstitutes = async (offset: number, limit: number) => {
    const [institutes, totalCount] = await prisma.$transaction([
      prisma.institute.findMany({
        skip: offset,
        take: limit,
      }),
      prisma.institute.count(),
    ]);

    const paginatedInstitutes = {
        data: institutes,
        pagination: {
            offset,
            limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: (offset + limit) < totalCount,
        }
    };

    return paginatedInstitutes;
};


export const getInstituteById = async (id: string) => {
    const institute = await prisma.institute.findUnique({
        where: { id },
    });

    if (!institute) throw new Error(`Institute with id ${id} not found`);

    return institute;
};


export const addCourseToInstitute = async (instituteId: string, courseId: string) => {
    const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
    if (!institute) throw new Error('Institute not found');

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');

    const existing = await prisma.instituteCourse.findUnique({
        where: {
            institute_id_course_id: {
                institute_id: instituteId,
                course_id: courseId,
            },
        },
    });

    if (existing) {
        throw new Error('Course already added to this institute');
    }

    return await prisma.instituteCourse.create({
        data: {
            institute_id: instituteId,
            course_id: courseId,
        },
        include: {
            institute: true,
            course: true,
        },
    });
};


export const removeCourseFromInstitute = async (instituteId: string, courseId: string) => {
    const existing = await prisma.instituteCourse.findUnique({
        where: {
            institute_id_course_id: {
                institute_id: instituteId,
                course_id: courseId,
            },
        },
    });

    if (!existing) {
        throw new Error('Course not associated with this institute');
    }

    return await prisma.instituteCourse.delete({
        where: {
            institute_id_course_id: {
                institute_id: instituteId,
                course_id: courseId,
            },
        },
    });
};


export const addStudentToInstitute = async (instituteId: string, studentId: string) => {
    const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
    if (!institute) throw new Error('Institute not found');
    
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error('Student not found');

    const existing = await prisma.studentInstitute.findUnique({
        where: {
            student_id_institute_id: {
                student_id: studentId,
                institute_id: instituteId,
            },
        },
    });

    if (existing) {
        throw new Error('Student already associated with this institute');
    }

    return await prisma.studentInstitute.create({
        data: {
            student_id: studentId,
            institute_id: instituteId,
        },
        include: {
            student: true,
            institute: true,
        },
    });
};


export const removeStudentFromInstitute = async (instituteId: string, studentId: string) => {
    const existing = await prisma.studentInstitute.findUnique({
        where: {
            student_id_institute_id: {
                student_id: studentId,
                institute_id: instituteId,
            },
        },
    });

    if (!existing) {
        throw new Error('Student not associated with this institute');
    }

    return await prisma.studentInstitute.delete({
        where: {
            student_id_institute_id: {
                student_id: studentId,
                institute_id: instituteId,
            },
        },
    });
};