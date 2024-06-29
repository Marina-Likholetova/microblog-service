const { session: sessionConfig } = require("config");

const ROLES = {
    admin: 'admin',
    user: 'user'
}

function authIniteSessionAndRedirect(redirectTo) {
    return (req, resp) => {
        req.session.context = req.__authContext;
        resp.redirect(redirectTo || req.baseUrl);
    };
}

function authDestroySessionAndRedirect(redirectTo) {
    return (req, resp) => {
        req.session.destroy(() => {
            resp.clearCookie(sessionConfig.cookieName);
            resp.redirect(redirectTo || req.baseUrl);
        })
    }
}

function restrictResource(permittedForRoles = []) {
    return (req, resp, next) => {
        const { role } = req.session?.context || {};
        if (permittedForRoles.includes(role)) {
            return next()
        }

        resp.redirect(`${req.baseUrl}/login`);
    }
}

module.exports = {
    authIniteSessionAndRedirect,
    authDestroySessionAndRedirect,
    restrictResource,
    ROLES
};