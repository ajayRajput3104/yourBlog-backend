// middleware/validationMiddleware.js
import { body, validationResult } from 'express-validator';

export const validateSignup = [
    body('username')
    .notEmpty().withMessage('Username is required'),
    body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage('Invalid email address'),
    body('password')
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

export const validateLogin = [
    body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage('Invalid email address'),
    body('password')
    .notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
