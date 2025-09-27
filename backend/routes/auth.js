
import express from 'express';
import { register, login, getMe } from '../controllers/auth.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe); // New route to get authenticated user's data

export default router;
