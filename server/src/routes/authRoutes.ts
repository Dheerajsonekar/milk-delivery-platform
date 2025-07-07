import express from 'express';
import { register, login, logout, checkAuth, getProfile } from '../controllers/authcontroller';
import { verifyToken } from '../middlewares/auth'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', checkAuth);
router.get('/profile', verifyToken,  getProfile)

export default router;
