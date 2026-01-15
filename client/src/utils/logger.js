const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
    log: (...args) => {
        if (isDevelopment) {
            console.log('[LOG]', new Date().toISOString(), ...args);
        }
    },

    info: (...args) => {
        if (isDevelopment) {
            console.info('[INFO]', new Date().toISOString(), ...args);
        }
    },

    warn: (...args) => {
        if (isDevelopment) {
            console.warn('[WARN]', new Date().toISOString(), ...args);
        }
    },

    error: (...args) => {
        console.error('[ERROR]', new Date().toISOString(), ...args);
    },

    debug: (...args) => {
        if (isDevelopment) {
            console.debug('[DEBUG]', new Date().toISOString(), ...args);
        }
    }
};

export default logger;
