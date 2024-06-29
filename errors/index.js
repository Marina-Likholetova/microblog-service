const { StatusCodes } = require("http-status-codes");

class ValidationError extends Error {
    constructor({ msg = "Validation failed", errors }) {
        super(msg);
        this.status = StatusCodes.BAD_REQUEST;
        this.errors = errors;
    }
}

class NotFoundError extends Error {
    constructor({ msg = "Resource not found", errors }) {
        super(msg);
        this.status = StatusCodes.NOT_FOUND;
        this.errors = errors;
    }
}

class AuthError extends Error {
    constructor({ msg = "Authentication failed", errors }) {
        super(msg);
        this.status = StatusCodes.BAD_REQUEST;
        this.errors = errors;
    }
}

module.exports = {
    ValidationError,
    NotFoundError,
    AuthError
};