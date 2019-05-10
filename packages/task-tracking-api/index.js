"use strict";
// Ensure environment is configured before including anything else.
// import 'dotenv-byenv/config';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("./app");
const server = express();
server.use(app_1.default);
server.listen(3001);
