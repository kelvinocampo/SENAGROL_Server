"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validatorParams = [
    (0, express_validator_1.check)('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres.')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios.'),
    (0, express_validator_1.check)('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres.')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos (_).'),
    (0, express_validator_1.check)('email')
        .trim()
        .isLength({ max: 100 })
        .withMessage('El correo electrónico no puede exceder los 100 caracteres.')
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido.'),
    (0, express_validator_1.check)('password')
        .trim()
        .isLength({ min: 8, max: 60 })
        .withMessage('La contraseña debe tener entre 8 y 60 caracteres.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.'),
    (0, express_validator_1.check)('faceScan')
        .trim()
        .isURL()
        .withMessage('La foto debe ser una URL válida.')
        .isLength({ max: 255 })
        .withMessage('La URL de la foto no puede exceder los 255 caracteres.'),
    (0, express_validator_1.check)('phone')
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('El número de teléfono debe tener entre 10 y 15 caracteres.')
        .matches(/^\d+$/)
        .withMessage('El número de teléfono solo puede contener dígitos.')
];
function validator(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
    }
    next();
}
exports.default = {
    validatorParams,
    validator
};
