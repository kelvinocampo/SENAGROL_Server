import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    check('precio_transporte')
        .trim()
        .isInt({ min: 1 })
        .withMessage('Debe tener un precio mayo a cero')
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
