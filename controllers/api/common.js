const { StatusCodes } = require("http-status-codes");
const { ValidationError, NotFoundError } = require("../../errors");

function notFoundHandler(_req, resp) {
    resp.status(StatusCodes.NOT_FOUND).send();
}

function businessLogicErrorHandler(err, _req, resp, _next) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
        return resp.status(err.status).json({ errors: err.errors || err.message });
    }

    resp.status(500).send({ errors: "Unexpected server error" });
}

module.exports = {
    notFoundHandler,
    businessLogicErrorHandler,
};
