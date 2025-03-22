import express from "express";
import IAController from "../controllers/IAController";
const router = express.Router();

router.post('/', IAController);

export default router;