const express = require("express");
const morgan = require("morgan")
const helmet = require("helmet")
const server = express();

server.use(express.json());
server.use(helmet())

server.get("/", (req, res) => {
    const message = process.env.MESSAGE || "hello from the fallback message";
    res.status(200).json({message, database: process.env.DB_NAME})
})