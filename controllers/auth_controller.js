const bcrypt = require("bcrypt");

const service = require("../services");
const { AuthError } = require("../errors");
const { getGravatarUrl, DEFAULT_USER_AVATAR } = require("../helpers/generateUserAvatar");

function authErrorConfig(username) {
    return {
        msg: `User [${username}] - invalid creds`,
        errors: {
            auth: "Invalid creds!",
        },
    };
}

async function logUserIn(req, _resp, next) {
    const { username, password } = req.body;

    const user = await service.user.getUserByName(username);

    if (!user) return next(new AuthError(authErrorConfig(username)));

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) return next(new AuthError(authErrorConfig(username)));

    const role = user.role || "user";
    const user_avatar = user.user_avatar || DEFAULT_USER_AVATAR;

    req.__authContext = { username, role, userId: user.id, user_avatar };

    next();
}

async function signUserUp(req, _resp, next) {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);

    const password_hash = await bcrypt.hash(password, salt);

    try {
        const role = "user";
        const user_avatar = getGravatarUrl(username);

        const user = await service.user.createNewUser({ username, password_hash, user_avatar, role });

        req.__authContext = { username, userId: user.id, user_avatar, role };

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    logUserIn,
    signUserUp,
};
