import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

import { userRouter } from "./routes/user.route.js";
import { authRouter } from "./routes/auth.routes.js";

export const app = express()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api', userRouter);

const PORT = process.env.PORT;
export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
