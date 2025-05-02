import { Request, Response } from "express";
import UserService from '../../Services/UserServices';
import Login from "../../Dto/User/LoginDto";

let login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    const login = await UserService.logIn(new Login(identifier, password));

    if (!login.logged) {
      return res.status(401).json({ status: login.status });
    }

    res.cookie("refreshToken", login.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost",
      path: '/usuario/refresh'
    });

    return res.status(200).json({ status: login.status, token: login.accessToken });

  } catch (error: any) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export default login;
