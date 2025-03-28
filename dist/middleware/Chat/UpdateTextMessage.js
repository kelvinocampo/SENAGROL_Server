"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validatorParams = [
    // Validar id en el body (debe ser entero)
    (0, express_validator_1.check)('user.id_user')
        .trim()
        .notEmpty()
        .withMessage('El Token es requerido')
        .isInt({ min: 1 })
        .withMessage('El Token contiene datos invalidos')
        .toInt(), // Convierte el valor a entero
    (0, express_validator_1.check)('user.roles')
        .trim()
        .notEmpty()
        .withMessage('El Token es requerido')
        .isIn(["admin", "vendedor", "transportador", "comprador", "vendedor transportador"])
        .withMessage('El Token contiene datos invalidos'),
    // Validar text en el body
    (0, express_validator_1.check)('text')
        .trim()
        .notEmpty()
        .withMessage('El texto del mensaje es requerido')
        .isLength({ min: 1, max: 255 })
        .withMessage('El texto debe tener entre 1 y 1000 caracteres'),
    // Validar id_chat en los parámetros de la ruta (debe ser entero)
    (0, express_validator_1.check)('id_chat')
        .trim()
        .notEmpty()
        .withMessage('El id_chat es requerido')
        .isInt({ min: 1 })
        .withMessage('El id_chat debe ser un número entero positivo')
        .toInt(), // Convierte el valor a entero
    // Validar id_message en los parámetros de la ruta (debe ser entero)
    (0, express_validator_1.check)('id_message')
        .trim()
        .notEmpty()
        .withMessage('El id_message es requerido')
        .isInt({ min: 1 })
        .withMessage('El id_message debe ser un número entero positivo')
        .toInt() // Convierte el valor a entero
];
function validator(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
exports.default = {
    validatorParams,
    validator
};
