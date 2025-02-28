require("dotenv").config();
const express = require("express");

const app = express();
const API_PORT = process.env.API_PORT || 8888;

app.listen(API_PORT, () => {
    console.log(`Now listening on port ${API_PORT}`)
})