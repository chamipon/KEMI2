require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const TaskRouter = require("./routes/task.router")

const app = express();
const API_PORT = process.env.API_PORT || 8888;

app.use(bodyParser.json());
app.use("/tasks",TaskRouter)

app.listen(API_PORT, () => {
    console.log(`Now listening on port ${API_PORT}`)
})