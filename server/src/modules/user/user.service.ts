import prisma from "../../../utils/prisma.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;


export const createUser = async (
    password: string,
    email: string,
) => {
    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });
    
    if (existingEmail) { throw new Error('Email already exists'); }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return await prisma.user.create({
        data: {
            password: hashedPassword,
            email,
        },
    });
};


export const updateUser = async (
    id: string,
    updates: {
        password?: string,
        email?: string,
    }
) => {    
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
    }

    // Checking if the new email is already in use by another user
    if (updates.email) {
        const emailExists = await prisma.user.findFirst({
            where: {
                email: updates.email,
                NOT: { id },
            },
        });

        if (emailExists) {
            throw new Error(`Email "${updates.email}" is already in use`);
        }
    }

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    return await prisma.user.update({
        where: { id },
        data: updates,
    });
};


export const deleteUser = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');

    return prisma.user.delete({ where: { id } });
};


export const getAllUsers = async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
};


export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    
    return user;
};


export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
}
