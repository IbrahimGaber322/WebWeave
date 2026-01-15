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

const createPostValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
    body('message')
        .optional()
        .trim()
        .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    body('tags.*')
        .optional()
        .trim()
        .isLength({ max: 30 }).withMessage('Each tag must be less than 30 characters'),
    handleValidationErrors
];

const updatePostValidation = [
    param('id')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
    body('message')
        .optional()
        .trim()
        .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters'),
    handleValidationErrors
];

const getPostValidation = [
    param('id')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    handleValidationErrors
];

const deletePostValidation = [
    param('id')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    handleValidationErrors
];

const searchPostsValidation = [
    query('searchQuery')
        .optional()
        .trim()
        .customSanitizer(value => value === 'null' ? '' : value)
        .isLength({ max: 100 }).withMessage('Search query must be less than 100 characters'),
    query('searchTags')
        .optional()
        .trim()
        .customSanitizer(value => value === 'null' ? '' : value),
    query('page')
        .optional()
        .customSanitizer(value => value === 'null' || value === '' ? '1' : value)
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    handleValidationErrors
];

const commentValidation = [
    param('id')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    body('message')
        .trim()
        .notEmpty().withMessage('Comment message is required')
        .isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters'),
    handleValidationErrors
];

const deleteCommentValidation = [
    param('postId')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isMongoId().withMessage('Invalid comment ID format'),
    handleValidationErrors
];

const replyValidation = [
    param('postId')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isMongoId().withMessage('Invalid comment ID format'),
    body('message')
        .trim()
        .notEmpty().withMessage('Reply message is required')
        .isLength({ max: 1000 }).withMessage('Reply must be less than 1000 characters'),
    handleValidationErrors
];

const deleteReplyValidation = [
    param('postId')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isMongoId().withMessage('Invalid comment ID format'),
    param('replyId')
        .notEmpty().withMessage('Reply ID is required')
        .isMongoId().withMessage('Invalid reply ID format'),
    handleValidationErrors
];

const likePostValidation = [
    param('id')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    handleValidationErrors
];

const likeCommentValidation = [
    param('postId')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isMongoId().withMessage('Invalid comment ID format'),
    handleValidationErrors
];

const likeReplyValidation = [
    param('postId')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid post ID format'),
    param('commentId')
        .notEmpty().withMessage('Comment ID is required')
        .isMongoId().withMessage('Invalid comment ID format'),
    param('replyId')
        .notEmpty().withMessage('Reply ID is required')
        .isMongoId().withMessage('Invalid reply ID format'),
    handleValidationErrors
];

const getPostsValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    handleValidationErrors
];

export {
    createPostValidation,
    updatePostValidation,
    getPostValidation,
    deletePostValidation,
    searchPostsValidation,
    commentValidation,
    deleteCommentValidation,
    replyValidation,
    deleteReplyValidation,
    likePostValidation,
    likeCommentValidation,
    likeReplyValidation,
    getPostsValidation,
    handleValidationErrors
};
