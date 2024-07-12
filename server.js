require("dotenv").config();
const { server: srvConfig, morgan: mrgConfig } = require("config");

const express = require("express");
const morgan = require("morgan");

const logger = require("./utils/logger")("server");
const { stream } = require("./utils/logStreamConfig");
const { sessionMiddleware } = require("./session");
const apiRouters = require("./routers/api/");
const { pagesRouter } = require("./routers/pages");

const app = express();
app.listen(srvConfig.port, () => logger.info(`Start listening on [${srvConfig.port}] port`))

app.set('view engine', 'pug');

app.use(morgan(mrgConfig.format));
app.use(morgan(mrgConfig.format, { stream }));

app.use(express.static("static"));

app.use(sessionMiddleware);

app.use('/uploads', express.static(srvConfig.uploadsDir));

app.use(express.json());

//api
app.use("/api/users", apiRouters.userRouter);
app.use("/api/posts", apiRouters.postRouter);
app.use("/api/comments", apiRouters.commentRouter);

//pages
app.use("/blog", pagesRouter)


process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});