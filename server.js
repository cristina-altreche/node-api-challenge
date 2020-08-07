const express = require("express");
const projectsRouter = require("./projects/projectsRouter");
const morgan = require("morgan");
const helmet = require("helmet");
const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

server.get("/", (req, res) => {
  const message = process.env.MESSAGE || "hello from the fallback message";
  res.status(200).json({ message, database: process.env.DB_NAME });
});

//CUSTOM MIDDLEWARE
///LOGGER
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

server.use("/api/projects", projectsRouter);

module.exports = server;
