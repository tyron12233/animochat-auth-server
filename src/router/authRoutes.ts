import { Router } from 'express';
import { login, validateToken, refreshToken, signInAnonymously } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/login/anonymous', signInAnonymously);
router.get('/validate', validateToken);
router.post('/refresh', refreshToken);

export default router;