import { Request, Response } from "express";
import UserService from '../../services/UserServices';
import generateToken from '../../Helpers/generateToken';
import Login from "../../Dto/User/LoginDto";

let login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; 
    const login = await UserService.logIn(new Login(identifier, password));

    const TOKEN_DURATION = 60;
    if (login.logged) {
      let token = generateToken(
        { id: login.data.id_usuario },
        process.env.KEY_TOKEN,
        TOKEN_DURATION
      );
      return res.status(200).json({
        status: login.status,
        token: token
      });
    }
    
    return res.status(401).json({
      status: login.status
    });

  } catch (error: any) {
    if (error && error.code == "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage });
    }
  }
};

export default login;
