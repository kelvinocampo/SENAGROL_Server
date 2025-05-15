import { body, check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

const validatorParams = [
    check('Nombre')
        .trim()
        .isLength({ min: 3, max: 100 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El nombre debe tener entre 3 y 100 caracteres y solo puede contener letras y espacios.'),

    check('Precio')
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser un número positivo mayor a 0.'),

    check('Description')
        .trim()
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder los 500 caracteres.'),

    check('latitud')
        .isFloat({ min: -90, max: 90 })
        .withMessage('La latitud debe estar entre -90 y 90.'),

    check('longitud')
        .isFloat({ min: -180, max: 180 })
        .withMessage('La longitud debe estar entre -180 y 180.'),

    check('quantity')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero positivo mayor a 0.'),

    check('MinimumQuantity')
        .isInt({ min: 1 })
        .withMessage('La cantidad mínima debe ser un número entero positivo mayor a 0.')
        .custom((value, { req }) => {
            if (value > req.body.quantity) {
                throw new Error('La cantidad mínima no puede ser mayor que la cantidad total.');
            }
            return true;
        })
        .withMessage('La cantidad mínima no puede ser mayor que la cantidad total.'),

    check('imagen')
        .optional()
        .isURL()
        .withMessage('La imagen debe ser una URL válida.'),

    check('Discount')
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
