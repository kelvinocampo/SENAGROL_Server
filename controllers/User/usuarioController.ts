import { Request, Response } from 'express';

// Datos de prueba para simular usuarios
const usuarios = [
    { id: 1, email: 'usuario@example.com', password: '123456' },
    { id: 2, email: 'prueba@example.com', password: 'abcdef' }
];

// Controlador para editar la contraseña de recuperación
export const editarPassword = async (req: Request, res: Response) => {
    try {
        const { password, repeatPassword } = req.body;
        
        // Validar que las contraseñas coincidan
        if (password !== repeatPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        // Simulamos la actualización de la contraseña
        usuarios[0].password = password; // Aquí deberíamos buscar el usuario real en la base de datos
        
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
};
