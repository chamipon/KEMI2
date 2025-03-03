import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import TaskRouter from "./routes/task.router.js";
import Auth from './auth.js'
const app = express();
const API_PORT = process.env.API_PORT || 8888;

app.use(bodyParser.json());

//Authorization route. 
app.get("/auth", async(req,res) =>{
    const token = Auth.generateAccessToken(req.body.username);
    res.json(token);
})

app.use("/tasks",Auth.authenticate,TaskRouter)
app.listen(API_PORT, () => {
    console.log(`Now listening on port ${API_PORT}`)
})

