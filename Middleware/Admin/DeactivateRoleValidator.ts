import { param, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    param("role")
        .trim()
        .isIn(["comprador", "vendedor", "administrador", "transportador"])
        .withMessage("Este rol no existe")
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
