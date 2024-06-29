const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");

const generator = (time, index) => {
    if (!time) return "current-file.log";

    let filename = time.toISOString().slice(0, 10);

    if (index > 1) {
        filename += `.${index}`;
    }

    return `${filename}-file.log`;
};

const serverLogDirectory = path.join(process.cwd(), "logs", "server-logs");

fs.existsSync(serverLogDirectory) || fs.mkdirSync(serverLogDirectory);

const stream = rfs.createStream(generator, {
    path: serverLogDirectory,
    size: "10M",
    interval: "1d",
    maxFiles: 14,
    history: "history.json"
});

module.exports = {
    stream
};