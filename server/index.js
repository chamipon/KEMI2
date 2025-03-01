import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import TaskRouter from "./routes/task.router.js";

const app = express();
const API_PORT = process.env.API_PORT || 8888;

app.use(bodyParser.json());
app.use("/tasks",TaskRouter)

app.listen(API_PORT, () => {
    console.log(`Now listening on port ${API_PORT}`)
})