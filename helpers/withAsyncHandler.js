const withAsyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    withAsyncHandler
}