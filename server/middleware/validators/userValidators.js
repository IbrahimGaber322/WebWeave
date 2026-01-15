import { body, param, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

const signUpValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain letters and numbers'),
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    handleValidationErrors
];

const signInValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .custom((value, { req }) => {
            // Password is only required for non-Google sign-ins
            if (!req.body.google && !value) {
                throw new Error('Password is required');
            }
            return true;
        }),
    handleValidationErrors
];

const editProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('about')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('About must be less than 500 characters'),
    handleValidationErrors
];

const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
];

const resetPasswordValidation = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain letters and numbers'),
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleValidationErrors
];

const addFriendValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
];

const removeFriendValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
];

const getOtherUserValidation = [
    param('otherUserEmail')
        .trim()
        .notEmpty().withMessage('User email is required')
        .isEmail().withMessage('Invalid email format'),
    handleValidationErrors
];

const confirmEmailValidation = [
    param('token')
        .trim()
        .notEmpty().withMessage('Token is required'),
    handleValidationErrors
];

const feedbackValidation = [
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
];

export {
    signUpValidation,
    signInValidation,
    editProfileValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    addFriendValidation,
    removeFriendValidation,
    getOtherUserValidation,
    confirmEmailValidation,
    feedbackValidation,
    handleValidationErrors
};
