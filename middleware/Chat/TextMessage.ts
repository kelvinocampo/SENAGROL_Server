import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    // Validar id en el body (debe ser entero)
    check('id')
        .trim()
        .notEmpty()
        .withMessage('El userID es requerido')
        .isInt({ min: 1 })
        .withMessage('El userID debe ser un número entero positivo')
        .toInt(), // Convierte el valor a entero

    // Validar text en el body
    check('text')
        .trim()
        .notEmpty()
        .withMessage('El texto del mensaje es requerido')
        .isLength({ min: 1, max: 255 })
        .withMessage('El texto debe tener entre 1 y 1000 caracteres'),

    // Validar id_chat en los parámetros de la ruta (debe ser entero)
    check('id_chat')
        .trim()
        .notEmpty()
        .withMessage('El id_chat es requerido')
        .isInt({ min: 1 })
        .withMessage('El id_chat debe ser un número entero positivo')
        .toInt() // Convierte el valor a entero
];

function validator(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default {
    validatorParams,
    validator
};