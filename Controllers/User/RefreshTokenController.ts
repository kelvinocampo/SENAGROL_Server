import { Request, Response } from "express";
import UserService from '../../Services/UserServices';

let refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const accessTokenData = await UserService.refreshAccessToken(refreshToken);

    if (!accessTokenData.logged) {
      return res.status(401).json({ status: accessTokenData.status });
    }

    return res.status(200).json({ status: accessTokenData.status, token: accessTokenData.accessToken });

  } catch (error: any) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export default refreshAccessToken;
