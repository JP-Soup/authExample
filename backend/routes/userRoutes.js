import express from 'express';
const router = express.Router();

import { registerUser, loginUser, getMe, getNewAccess } from '../controllers/userContollers.js';
import { routeAuthorization, validateCookie } from '../middlewares/authMiddleware.js';

router.post('/', registerUser);
router.post('/login', loginUser);

router.post('/access', getNewAccess);

router.post('/me', validateCookie, routeAuthorization, getMe);

export default router;
