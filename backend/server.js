import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorMiddleware.js';

import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

//---Connect to database---
connectDB();
//-------------------------

const app = express();

app.use(cookieParser(process.env.SESSION_COOKIE_SECRET));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port:${PORT}`));
