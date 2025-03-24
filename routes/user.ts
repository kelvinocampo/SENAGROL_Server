import express from "express";
import verifyToken from "../middleware/VerifyToken";
const router = express.Router();

router.post('/register');
router.post('/login');
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router; import express from "express";
import verifyToken from "../middleware/VerifyToken";
import { updatePasswordController } from "../controllers/userController";

const router = express.Router();

router.post('/register');
router.post('/login');
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);
router.patch('/password', verifyToken, updatePasswordController); // Nuevo endpoint

export default router;

