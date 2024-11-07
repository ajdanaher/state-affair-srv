/**
 * Utility Imports
 */
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import resTime from "response-time";
import moment from "moment/moment.js";
import shortid from "shortid";
import helmet from "helmet";

/**
 * Application Imports
 */
import serverConfigurations from "./serverConfigurations.js";
import log from "./src/helpers/Logger.js";
import { default as CODES } from "./src/helpers/statusCodes.js";
import { default as HealthRoutes } from "./src/routes/HealthRoutes.js";
import { default as NewsRoutes } from "./src/routes/NewsRoutes.js";
import { default as CacheRoutes } from "./src/routes/CacheRoutes.js";
import { default as CommentsRoutes } from "./src/routes/CommentsRoutes.js";

/**
 * Create Application
 */
const app = express();

/**
 * Include important middlewares
 */
app.use(helmet());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", ["http://localhost:3000"]);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(resTime());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  let corr_id = req.headers["X-Correlation-Id"];
  if (!corr_id) {
    corr_id = shortid.generate();
    req.headers["X-Correlation-Id"] = corr_id;
  }
  res.set({
    "X-Correlation-Id": corr_id,
  });
  res.setHeader("Content-Type", "application/json");
  next();
});

/**
 * Set Application Routes
 */
app.use("/v1/ping", HealthRoutes);
app.use("/v1/cache", CacheRoutes);
app.use("/v1/news", NewsRoutes);
app.use("/v1/comments", CommentsRoutes);

app.use((req, res) => {
  const statusMessage = `Not Found [${req.url}]`;
  const status = CODES.NOT_FOUND;
  res.status(status).json({
    statusMessage,
    time: moment(Date.now())
      .utcOffset("-07:00")
      .format("MMMM Do YYYY, h:mm:ssa"),
  });
});

/**
 * Create Server
 */
const server = http.createServer(app);
server.listen(serverConfigurations.port, () => {
  log.info("server started !!!");
});
