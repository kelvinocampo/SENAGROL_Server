import { Router } from 'express';
import * as usuarioController from '../controllers/User/usuarioController';

const router = Router();

// Endpoint para editar la contraseña de recuperación
router.patch('/password', usuarioController.editarPassword);

export default router;

