import { Request, Response } from "express";
import UserService from '../../services/UserServices';
import generateToken from '../../Helpers/generateToken';
import Login from "../../Dto/LoginDto";

let login = async (req: Request, res: Response) => {
  console.log("📌 Llega al controlador"); // Confirmar que la solicitud llega
  
  try {
    const { identifier, password } = req.body; 
    console.log("🔍 Identificador recibido:", identifier);
    
    const login = await UserService.logIn(new Login(identifier, password));
    console.log("✅ Respuesta de logIn:", login);

    if (login.logged) {
      console.log("🔐 Generando token...");
      let token = generateToken(
        { id: login.data.id_usuario },
        process.env.KEY_TOKEN,
        60
      );
      console.log("✅ Token generado:", token);
      return res.status(200).json({ status: login.status, token });
    }
    
    console.log("❌ Login fallido:", login.status);
    return res.status(401).json({ status: login.status });

  } catch (error: any) {
    console.error("⚠️ Error en el login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export default login;
