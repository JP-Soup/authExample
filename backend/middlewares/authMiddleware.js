import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const routeAuthorization = asyncHandler(async (req, res, next) => {
	const { access } = req.body;

	try {
		// Verify access token
		const decodedAccess = jwt.verify(access, process.env.JWT_SECRET_ACCESS_TOKEN);

		// Attach user details to the request body
		req.user = await User.findById(decodedAccess.id).select('-_id -password -createdAt -updatedAt');

		// Next will fire if access token is verified and user exists
		next();
	} catch (err) {
		res.status(401);
		throw new Error('Not authorized, please login or create an account');
	}
});

export { routeAuthorization };

const validateCookie = asyncHandler(async (req, res, next) => {
	try {
		const { cookies } = req;

		const cookieFingerprint = cookies.userFingerprint;

		// Hash cookie fingerprint in order to allow for comparison against session fingerprint
		const hashedFingerprint = crypto.createHash('sha256').update(cookieFingerprint).digest('hex');

		// This is the fingerprint from session storage on client
		const fingerprint = JSON.parse(req.body.fingerprint);

		// Verify fingerprint from session storage with secret
		const decodedFingerprint = jwt.verify(fingerprint, process.env.JWT_SECRET_COOKIE_TOKEN);

		// Throw an error if the fingerprints do not match else call next
		hashedFingerprint === decodedFingerprint.id ? next() : new Error('Invalid Credentials');
	} catch (err) {
		res.status(401);
		throw new Error('Unable to confirm credentials, please login');
	}
});

export { validateCookie };
