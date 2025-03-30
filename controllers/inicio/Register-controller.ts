import { Request, Response } from "express";



let register = async (req: Request, res: Response) => {
  try {
    const {
      Username,
      Email,
      Name,
      Telefono, 
      Password,
        
    } = req.body;
    return res.status(201).json(
      { status: 'register ok'}
    );
  } catch (error: any) {
    if (error && error.code == "ER_DUP_ENTRY") {
      return res.status(500).json({ errorInfo: error.sqlMessage }
      );
    }
  }
}


export default register;