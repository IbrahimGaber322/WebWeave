import { body, param, query, validationResult } from 'express-validator';

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

const getConversationValidation = [
    param('friendEmail')
        .trim()
        .notEmpty().withMessage('Friend email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidationErrors
];

const getMessagesValidation = [
    param('conversationId')
        .notEmpty().withMessage('Conversation ID is required')
        .isMongoId().withMessage('Invalid conversation ID format'),
    query('page')
        .optional()
        .customSanitizer(value => value === 'null' || value === '' ? '1' : value)
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .customSanitizer(value => value === 'null' || value === '' ? '30' : value)
        .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    handleValidationErrors
];

const sendMessageValidation = [
    body('conversationId')
        .notEmpty().withMessage('Conversation ID is required')
        .isMongoId().withMessage('Invalid conversation ID format'),
    body('content')
        .trim()
        .notEmpty().withMessage('Message content is required')
        .isLength({ max: 2000 }).withMessage('Message must be under 2000 characters'),
    handleValidationErrors
];

const markAsReadValidation = [
    param('conversationId')
        .notEmpty().withMessage('Conversation ID is required')
        .isMongoId().withMessage('Invalid conversation ID format'),
    handleValidationErrors
];

export {
    getConversationValidation,
    getMessagesValidation,
    sendMessageValidation,
    markAsReadValidation,
    handleValidationErrors
};
