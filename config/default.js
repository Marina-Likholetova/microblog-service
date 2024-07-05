const path = require("path");
const isProd = process.env.NODE_ENV === "production";
const colorsEnabled = +process.env.COLORS_ENABLED || 0;
const logLevel = process.env.LOG_LEVEL || "warn";

module.exports = {
    logger: { colorsEnabled, logLevel },
    server: {
        port: Number(process.env.PORT) || 3004,
        uploadsDir: path.join(process.cwd(), 'uploads')
    },
    morgan: {
        format: process.env.MORGAN_FORMAT || "dev",
    },
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        dbType: process.env.DATABASE_URL.includes("mongo") ? "mongo" : "sql",
    },
    session: {
        secureCookie: isProd,
        cookieName: "sid",
        secret: process.env.SESSION_SECRET || Math.random().toString(36).slice(2),
    }
};