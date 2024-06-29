require("dotenv").config();
const { session: sessionConfig, db: dbConfig } = require("config");

const session = require("express-session");
const sessionStorage = require("connect-mongo");

const sessionMiddleware = session({
    secret: sessionConfig.secret,
    name: sessionConfig.cookieName,
    store: sessionStorage.create({
        mongoUrl: `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.name}`,
        autoRemove: "native",
        ttl: 24 * 60 * 60, // session expiration (1d)
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: sessionConfig.secureCookie,
    },
});

module.exports = {
    sessionMiddleware,
};
