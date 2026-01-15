import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || 'test';

const user = (req, res, next) => {
    try {
        const authHeader = req?.headers?.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Authentication failed: No token provided', {
                ip: req.ip,
                path: req.path
            });
            return res.status(401).json({
                success: false,
                message: "Unauthenticated: No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                logger.warn('Authentication failed: Invalid token', {
                    ip: req.ip,
                    path: req.path,
                    error: err.message
                });
                return res.status(401).json({
                    success: false,
                    message: "Unauthenticated: Invalid or expired token"
                });
            }

            req.userEmail = decoded?.email;
            req.token = token;
            next();
        });
    } catch (error) {
        logger.error('Authentication middleware error', {
            error: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication"
        });
    }
};

export default user;