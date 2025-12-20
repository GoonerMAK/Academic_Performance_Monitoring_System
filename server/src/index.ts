import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

import { userRouter } from "./routes/user.route.js";
import { authRouter } from "./routes/auth.routes.js";
import { instituteRouter } from "./routes/institute.routes.js";
import { courseRouter } from "./routes/course.route.js";
import { resultRouter } from "./routes/result.route.js";

export const app = express()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', instituteRouter);
app.use('/api', courseRouter);
app.use('/api', resultRouter);

const PORT = process.env.PORT;
export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
