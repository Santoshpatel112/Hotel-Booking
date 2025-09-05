import express from "express";
const router = express.Router();
import { Login, Register  } from "../Controllers/auth.js";

router.post('/register', Register);
router.post('/login', Login);
export default router;