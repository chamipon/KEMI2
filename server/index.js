require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const API_PORT = process.env.API_PORT || 8888;

var MONGODB_URI="mongodb://root:example@mongo:27017"
const client = new MongoClient(MONGODB_URI);

app.listen(API_PORT, () => {
    console.log(`Now listening on port ${API_PORT}`)
})