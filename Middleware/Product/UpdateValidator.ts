import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

const validatorParams = [
    check('user.id_user')
        .trim()
        .notEmpty()
        .withMessage('El Token es requerido')
        .isInt({ min: 1 })
        .withMessage('El Token contiene datos invalidos')
        .toInt(), // Convierte el valor a entero

    check('user.roles')
        .trim()
        .notEmpty()
        .withMessage('El Token es requerido')
        .isIn(["admin", "vendedor", "transportador", "comprador", "vendedor transportador"])
        .withMessage('El Token contiene datos invalidos'),


    check('Nombre')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El nombre debe tener entre 3 y 100 caracteres y solo puede contener letras y espacios.'),

    check('Precio')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser un número positivo mayor a 0.'),

    check('Description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder los 500 caracteres.'),

    check('latitud')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('La latitud debe estar entre -90 y 90.'),

    check('longitud')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('La longitud debe estar entre -180 y 180.'),

    check('quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero positivo mayor a 0.'),

    check('MinimumQuantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad mínima debe ser un número entero positivo mayor a 0.'),

    check('imagen')
        .optional()
        .isURL()
        .withMessage('La imagen debe ser una URL válida.'),

    check('Discount')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('El descuento debe ser un número entre 0 y 100.')
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
