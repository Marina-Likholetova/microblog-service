const bcrypt = require("bcrypt");

const service = require("../services");
const { AuthError } = require("../errors");
const { ROLES } = require("../middlewares/authContext");
const { getGravatarUrl, DEFAULT_USER_AVATAR } = require("../helpers/generateUserAvatar");
const logger = require("../utils/logger")("auth controller");

function throwAuthError(username) {
    throw new AuthError({
        msg: `User [${username}] - invalid creds`,
        errors: {
            auth: "Invalid creds!",
        }
    })
}

async function logUserIn(req, _resp, next) {
    const { username, password } = req.body;
    
    try {
        const user = await service.user.getUserByName(username);

        if (!user) throwAuthError(username);

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) throwAuthError(username);

        const role = user.role || ROLES.user;
        const user_avatar = user.user_avatar || DEFAULT_USER_AVATAR;

        req.__authContext = { username, role, userId: user.id, user_avatar };

        logger.info(`User [${username}] with role [${role}] - successfully logged in!`);

        next();
    } catch (error) {
        next(error);
    }
}

async function signUserUp(req, _resp, next) {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);

    const password_hash = await bcrypt.hash(password, salt);

    try {
        const role = ROLES.user;
        const user_avatar = getGravatarUrl(username);

        const user = await service.user.createNewUser({ username, password_hash, user_avatar, role });

        req.__authContext = { username, userId: user.id, user_avatar, role };

        logger.info(`User [${username}] with role [${role}] - successfully created new account!`);

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    logUserIn,
    signUserUp,
};
