// Error Display MiddleWare
class ExpressError extends Error {
    constructor (message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// Export Block
module.exports = ExpressError;