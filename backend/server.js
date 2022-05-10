import path from 'path';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
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

//Serve Frontend
// const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
	// Set build folder as static
	app.use(express.static(path.join(__dirname, '../frontend/build')));

	app.get('*', (_, res) => {
		res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
	});
} else {
	app.get('/', (req, res) => {
		res.status(200).json({ message: 'Welcome to AuthExample' });
	});
}

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port:${PORT}`));
