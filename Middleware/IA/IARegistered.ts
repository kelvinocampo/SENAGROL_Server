import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    check('prompt')
        .trim()
        .notEmpty()
        .withMessage('El prompt se encuentra vacio')
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