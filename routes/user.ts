mport express from "express";
import verifyToken from "../middleware/VerifyToken";
const router = express.Router();

router.post('/register');
router.post('/login');
router.post('/edit', verifyToken);
router.post('/profile', verifyToken);

export default router;  

