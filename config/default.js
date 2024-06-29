const isProd = process.env.NODE_ENV === "production";
const colorsEnabled = +process.env.COLORS_ENABLED || 0;
const logLevel = process.env.LOG_LEVEL || "warn";

module.exports = {
    logger: { colorsEnabled, logLevel },
    server: {
        port: Number(process.env.PORT) || 3004,
    },
    morgan: {
        format: process.env.MORGAN_FORMAT || "dev",
    }
};