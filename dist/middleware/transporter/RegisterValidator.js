"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let transporterValidatorParams = [
    (0, express_validator_1.check)('license')
        .trim()
        .isLength({ min: 5, max: 30 })
        .withMessage('La licencia de conducción debe tener entre 5 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage('La licencia solo puede contener letras, números y guiones.'),
    (0, express_validator_1.check)('soat')
        .trim()
        .isLength({ min: 5, max: 30 })
        .withMessage('El SOAT debe tener entre 5 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage('El SOAT solo puede contener letras, números y guiones.'),
    (0, express_validator_1.check)('vehicleCard')
        .trim()
        .isLength({ min: 5, max: 30 })
        .withMessage('La tarjeta de propiedad debe tener entre 5 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage('La tarjeta de propiedad solo puede contener letras, números y guiones.'),
    (0, express_validator_1.check)('vehicleType')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('El tipo de vehículo debe tener entre 3 y 50 caracteres.')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El tipo de vehículo solo puede contener letras y espacios.'),
    (0, express_validator_1.check)('vehicleWeight')
        .trim()
        .isNumeric()
        .withMessage('El peso del vehículo debe ser un número.')
        .isFloat({ min: 500, max: 50000 })
        .withMessage('El peso del vehículo debe estar entre 500 y 50,000 kg.')
];
function transporterValidator(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
    }
    next();
}
exports.default = {
    transporterValidatorParams,
    transporterValidator
};
