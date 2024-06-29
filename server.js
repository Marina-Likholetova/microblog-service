require("dotenv").config();
const { server: srvConfig, morgan: mrgConfig } = require("config");

const express = require("express");
const morgan = require("morgan");

const logger = require("./utils/logger")("server");
const { stream } = require("./utils/logStreamConfig");

const app = express();
app.listen(srvConfig.port, () => logger.info(`Start listening on [${srvConfig.port}] port`))

app.use(morgan(mrgConfig.format));
app.use(morgan(mrgConfig.format, { stream }));
app.use(express.json());

