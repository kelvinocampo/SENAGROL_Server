import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    check('name')
        .trim()
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres.')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios.'),

    check('username')
        .trim()
        .optional()
        .isLength({ min: 3, max: 20 })
        .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres.')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos (_).'),

    check('email')
        .trim()
        .optional()
        .isLength({ max: 100 })
        .withMessage('El correo electrónico no puede exceder los 100 caracteres.')
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido.'),

    check('password')
        .trim()
        .optional()
        .isLength({ min: 8, max: 60 })
        .withMessage('La contraseña debe tener entre 8 y 60 caracteres.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.'),

    check('phone')
        .trim()
        .optional()
        .isLength({ min: 10, max: 15 })
        .withMessage('El número de teléfono debe tener entre 10 y 15 caracteres.')
        .matches(/^\d+$/)
        .withMessage('El número de teléfono solo puede contener dígitos.'),

    check('confirmPassword')
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden.'),

    check('license')
        .trim()
        .optional()
        .isLength({ min: 5, max: 30 })
        .withMessage('La licencia de conducción debe tener entre 5 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage('La licencia solo puede contener letras, números y guiones.'),

    check('soat')
        .trim()
        .optional()
        .isLength({ min: 5, max: 30 })
        .withMessage('El SOAT debe tener entre 5 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage('El SOAT solo puede contener letras, números y guiones.'),

    check('vehicleCard')
        .trim()
        .optional()
        .isLength({ min: 5, max: 30 })
        .withMessage('La tarjeta de propiedad debe tener entre 5 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage('La tarjeta de propiedad solo puede contener letras, números y guiones.'),

    check('vehicleType')
        .trim()
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('El tipo de vehículo debe tener entre 3 y 50 caracteres.')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El tipo de vehículo solo puede contener letras y espacios.'),

    check('vehicleWeight')
        .trim()
        .optional()
        .isNumeric()
        .withMessage('El peso del vehículo debe ser un número.')
        .isFloat({ min: 500, max: 50000 })
        .withMessage('El peso del vehículo debe estar entre 500 y 50,000 kg.')
];

function validator(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
    }
    next();
}

export default {
    validatorParams,
    validator
};
