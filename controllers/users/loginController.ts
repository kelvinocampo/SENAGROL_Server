import { Request, Response } from "express";
import UserService from '../../services/UserServices';
import generateToken from '../../Helpers/generateToken';
import Login from "../../Dto/User/LoginDto";

let login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    
    const login = await UserService.logIn(new Login(identifier, password));

    if (login.logged) {
      let token = generateToken(
        { id: login.data.id_usuario },
        process.env.KEY_TOKEN,
        60
      );
      return res.status(200).json({ status: login.status, token });
    }
    
    return res.status(401).json({ status: login.status });

  } catch (error: any) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export default login;
