import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.meta ? ' ' + JSON.stringify(info.meta) : ''}`
    )
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.json()
);

const logsDir = path.join(__dirname, '..', 'logs');

const transports = [
    new winston.transports.Console({
        format: format,
    }),
    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 5,
    }),
    new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 5,
    }),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    transports,
});

export default logger;
