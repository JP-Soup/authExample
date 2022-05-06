import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import User from '../models/userModel.js';

// Generate access json web token
const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_ACCESS_TOKEN, {
		//TODO: Change this to 1m
		expiresIn: '10s',
	});
};

// Generate refresh json web token
const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
		expiresIn: '1h',
	});
};

// Generate finger printjson web token
const generateFingerprint = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_COOKIE_TOKEN, {
		expiresIn: '1d',
	});
};

// @desc    Login a new user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Authenticate that user exists in db
	const user = await User.findOne({ email });

	// Check user and passwords match
	if (user && (await bcrypt.compare(password, user.password))) {
		// 1. Generate random string = fingerprint
		const jwtRandomString = cryptoRandomString({ length: 64, type: 'url-safe' });

		// 2. Hash fingerprint
		const hashedFingerprint = crypto.createHash('sha256').update(jwtRandomString).digest('hex');

		// 3. Generate JWT fingerprint token
		const fingerprint = generateFingerprint(hashedFingerprint);

		// 4. Generate Access and Refresh Tokens
		const jwtAccess = generateAccessToken(user._id);
		const jwtRefresh = generateRefreshToken(user._id);

		res.cookie('session_id', process.env.SESSION_COOKIE_ID, {
			maxAge: 86400000, // This is one day in milliseconds
			signed: true,
			httpOnly: true,
			sameSite: 'strict',
			// TODO: secure: true ---------->>>>> This will need to be enabled before deployment.
		});

		res.cookie('userFingerprint', jwtRandomString, {
			maxAge: 86400000, // This is one day in milliseconds
			httpOnly: true,
			sameSite: 'strict',
			// TODO: secure: true ---------->>>>> This will need to be enabled before deployment.
		});

		res.status(201).json({
			token: jwtAccess,
			refreshToken: jwtRefresh,
			fingerprint: fingerprint,
		});
	} else {
		res.status(401);
		throw new Error('Invalid user credentials');
	}
});

// @desc    Get current user
// @route   /api/users/me
// @access  Private
// @uses	Profile page
const getMe = asyncHandler(async (req, res) => {
	// Pull the user off the request
	const user = req.user;

	// Respond with user details, which will update getMe state in RTK
	if (user) {
		res.status(201).json({
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(401);
		throw new Error('Please create an account or login');
	}
});

// @desc    Get new access token
// @route   /api/users/access
// @access  Private
// @uses	Uses refresh token to return new access token
const getNewAccess = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body;

	const parsedRefreshToken = JSON.parse(refreshToken);

	try {
		// Verify refresh token
		const decodedRefreshToken = jwt.verify(parsedRefreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);

		if (decodedRefreshToken) {
			const token = generateAccessToken(decodedRefreshToken.id);

			// Respond with new access token
			res.status(201).json({
				token: token,
			});
		}
	} catch (err) {
		res.status(401);
		throw new Error('Please login to continue using shopit');
	}
});

export { loginUser, getMe, getNewAccess };
