import { Request, Response } from "express";
import UserService from "../../Services/UserServices";
import User from "../../Dto/User/UserDto";

let register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone
    } = req.body;

    const registerUser = await UserService.register( new User(name, username, email, password, phone));

    return res.status(201).json({ status: "register ok" });
  } catch (error: any) {
    if (error && error.code == "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage });
    }
  }
};

export default register;
