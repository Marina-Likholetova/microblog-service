require("dotenv").config();
const { server: srvConfig, morgan: mrgConfig } = require("config");

const express = require("express");
const morgan = require("morgan");

const logger = require("./utils/logger")("server");
const { stream } = require("./utils/logStreamConfig");
const { sessionMiddleware } = require("./session");
const { api } = require("./routers/api/");

const app = express();
app.listen(srvConfig.port, () => logger.info(`Start listening on [${srvConfig.port}] port`))

app.set('view engine', 'pug');

app.use(morgan(mrgConfig.format));
app.use(morgan(mrgConfig.format, { stream }));

app.use(sessionMiddleware);

app.use(express.static("static"));

app.use(express.json());

app.use("/api/users", api.userRouter);
app.use("/api/posts", api.postRouter);
app.use("/api/comments", api.commentRouter);

