import { Request, Response } from "express";
import UserService from "../../Services/UserServices";

let updatePassword = async (req: Request, res: Response) => {
  try {
    const { password, id_user } = req.body;

    const editPassword = await UserService.UpdatePassword(password, parseInt(id_user));

    return res.status(201).json({ status: "register ok" });
  } catch (error: any) {
    if (error && error.code == "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage });
    }
  }
};

export default updatePassword;
