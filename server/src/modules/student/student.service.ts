import prisma from "../../../utils/prisma.js";


export const createStudent = async (data: {
    name: string;
    email: string;
    student_id?: string;
    age?: number;
    gender?: string;
    nationality?: string;
}) => {
    const emailExists = await prisma.student.findUnique({
        where: { email: data.email },
    });

    if (emailExists) {
        throw new Error(`Student with email "${data.email}" already exists`);
    }

    return await prisma.student.create({
        data: {
            name: data.name,
            email: data.email,
            student_id: data.student_id,
            age: data.age,
            gender: data.gender,
            nationality: data.nationality,
        },
    });
};


export const updateStudent = async (
    id: string,
    updates: {
        name?: string;
        email?: string;
        student_id?: string;
        age?: number;
        gender?: string;
        nationality?: string;
    }
) => {
    const existingStudent = await prisma.student.findUnique({
        where: { id },
    });

    if (!existingStudent) throw new Error(`Student with id ${id} not found`);

    // Checking if the new email is already in use by another student
    if (updates.email) {
        const emailExists = await prisma.student.findFirst({
            where: {
                email: updates.email,
                NOT: { id },
            },
        });

        if (emailExists) {
            throw new Error(`Email "${updates.email}" is already in use`);
        }
    }

    return await prisma.student.update({
        where: { id },
        data: updates,
    });
};


export const deleteStudent = async (id: string) => {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) throw new Error('Student not found');

    return await prisma.student.delete({ where: { id } });
};


export const getAllStudents = async () => {
    return await prisma.student.findMany();
};


export const getStudentByEmail = async (email: string) => {
    const student = await prisma.student.findUnique({
        where: { email },
        include: {
            institutes: {
                include: {
                    institute: true,
                },
            },
            courses: {
                include: {
                    course: true,
                },
            },
            results: {
                include: {
                    course: true,
                    institute: true,
                },
            },
        },
    });

    if (!student) throw new Error(`Student with email ${email} not found`);

    return student;
};


export const addStudentToCourse = async (studentId: string, courseId: string) => {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error('Student not found');

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');

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


export const removeStudentFromCourse = async (studentId: string, courseId: string) => {
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


export const addStudentToInstitute = async (studentId: string, instituteId: string) => {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error('Student not found');

    const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
    if (!institute) throw new Error('Institute not found');

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


export const removeStudentFromInstitute = async (studentId: string, instituteId: string) => {
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