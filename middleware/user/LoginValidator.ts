import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";
let validatorParams = [
    
    check('identifier')
        .trim()
        .isLength({ max: 100 })
        .withMessage('El identificador no puede exceder los 100 caracteres.')
        .custom(value => {
            const isEmail = /\S+@\S+\.\S+/.test(value); // Verifica si es email
            const isUsername = /^[a-zA-Z0-9_.-]+$/.test(value); // Verifica si es usuario
            if (!isEmail && !isUsername) {
                throw new Error('Debe proporcionar un usuario o correo válido.');
            }
            return true;
        }),

    check('password')
        .trim()
        .isLength({ min: 8, max: 100 })
        .withMessage('La contraseña debe tener entre 8 y 100 caracteres.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.'),
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
