"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const api_1 = require("./api");
const app = express();
app.use('/api', api_1.default, (req, res) => {
    // Anything falling through the API on that URI should be treated as
    // not found.
    res.status(404).json('404 Not Fount');
});
const buildDirPath = path.join(__dirname, 'build');
app.use(express.static(buildDirPath));
const indexPath = path.join(buildDirPath, 'index.html');
app.get('*', (req, res, next) => {
    res.sendFile(indexPath, next);
}, (ex, req, res, next) => {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send("I guess we'll never know who got rid of the cat video.");
});
exports.default = app;
