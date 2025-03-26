import { Request, Response } from "express";
import db from "../../config/configDB"; // Asegúrate de importar la conexión a la BD

let getProducts = async (req: Request, res: Response) => {
  try {
    // Consulta SQL para obtener todos los productos
    const [rows] = await db.query("SELECT * FROM producto");

    return res.status(200).json({
      status: "query ok",
      Products: rows, // Devuelve los productos obtenidos de la BD
    });
  } catch (error: any) {
    console.error("Error en getProducts:", error);
    return res.status(500).json({ error: "Error al obtener productos" });
  }
};

export default getProducts;
