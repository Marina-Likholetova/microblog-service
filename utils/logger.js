const { disable, bgBlue, bgYellow, bgRed } = require("colors/safe");
const { logger: { colorsEnabled, logLevel } } = require("config");
const fs = require("fs");
const path = require("path");

const logDirPath = path.resolve(process.cwd(), "logs");
const infoStreamPath = path.join(logDirPath, "info.log");
const errorStreamPath = path.join(logDirPath, "errors.log");

const logMessageTemplate = (moduleName, ...data) =>
    `${new Date().toISOString()} ${moduleName}: ${data.join(", ")}\n`;

try {
    fs.accessSync(logDirPath);
} catch (err) {
    fs.mkdirSync(logDirPath);
}

const infoStream = fs.createWriteStream(infoStreamPath, { flags: "a" });
const errorStream = fs.createWriteStream(errorStreamPath, { flags: "a" });

infoStream.on("error", (err) => {
    console.log("Info stream error", err.message);
});

errorStream.on("error", (err) => {
    console.log("Error stream error", err.message);
});

// wrapper for writing data
const logToFile = (streamFile, moduleName, ...args) => {
    streamFile.write(logMessageTemplate(moduleName, ...args));

};

function getLogger(moduleName) {
    !colorsEnabled && disable();

    return {
        info: (...args) => {
            logToFile(infoStream, moduleName, ...args);
            logLevel === "info" && console.log(bgBlue(`${moduleName}:`), ...args);
        },
        warn: (...args) => {
            logToFile(errorStream, moduleName, ...args);
            logLevel !== "error" && console.error(bgYellow(`${moduleName}:`), ...args);
        },
        error: (...args) => {
            logToFile(errorStream, moduleName, ...args);
            console.error(bgRed(`${moduleName}:`), ...args);
        },
    };
}

process.on("beforeExit", () => {
    infoStream.end();
    errorStream.end();
});

module.exports = getLogger;