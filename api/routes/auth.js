import express from 'express';
import { Register as register, Login as login } from '../Controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;