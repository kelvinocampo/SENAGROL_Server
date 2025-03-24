import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UpdatePasswordDto } from "../../Dto/UserDto";
import db from "../../config/database"; // BD conexion 

const updatePassword = async (req: Request, res: Response) => {
    try {
        const { password, repeatPassword }: UpdatePasswordDto = req.body;

        if (password !== repeatPassword) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = req.user.id; // Se asume que el usuario está autenticado y el ID viene en `req.user`

        await db.query("UPDATE usuario SET contraseña = ? WHERE id_usuario = ?", [hashedPassword, userId]);

        return res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la contraseña" });
    }
};

export default updatePassword;

//Valida que ambas contraseñas coincidan.

//Hashea la nueva contraseña con bcrypt.

//Actualiza la contraseña en la base de datos.
