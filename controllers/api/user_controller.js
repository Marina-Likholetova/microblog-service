const { StatusCodes } = require("http-status-codes");
const service = require("../../services");

const withAsyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next);
    } catch (err) {
        next(err);
    }
};

async function getAllUsers(_req, resp) {
    const users = await service.user.getAllUsers();
    resp.json(users);
}

async function createNewUser(req, resp) {
    const user = await service.user.createNewUser(req.body);
    resp.status(StatusCodes.CREATED).json(user);
}

async function getUserById(req, resp) {
    const { userId } = req.params;

    const user = await service.getUserById(userId);
    resp.json(user);
}

async function deleteUserById(req, resp) {
    const { userId } = req.params;

    await service.user.deleteUserById(userId);
    resp.status(StatusCodes.NO_CONTENT).send();
}

module.exports = {
    getAllUsers: withAsyncHandler(getAllUsers),
    getUserById: withAsyncHandler(getUserById),
    createNewUser: withAsyncHandler(createNewUser),
    deleteUserById: withAsyncHandler(deleteUserById),
};
