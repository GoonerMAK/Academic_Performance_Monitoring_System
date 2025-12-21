import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

import { userRouter } from "./modules/user/user.route.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { instituteRouter } from "./modules/institute/institute.routes.js";
import { courseRouter } from "./modules/course/course.route.js";
import { resultRouter } from "./modules/result/result.route.js";
import { studentRouter } from "./modules/student/student.route.js";

export const app = express()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', instituteRouter);
app.use('/api', courseRouter);
app.use('/api', resultRouter);
app.use('/api', studentRouter);

const PORT = process.env.PORT;
export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
