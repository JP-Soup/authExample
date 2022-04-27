import express from 'express';
const router = express.Router();

import { loginUser, getMe, getNewAccess } from '../controllers/userContollers.js';
import { routeAuthorization, validateCookie } from '../middlewares/authMiddleware.js';

router.post('/login', loginUser);

router.post('/access', getNewAccess);

router.post('/me', validateCookie, routeAuthorization, getMe);

export default router;
