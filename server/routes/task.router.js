import express from "express";
const TaskRouter = express.Router();
import TaskController from "../controllers/task.controller.js";


TaskRouter.get("/", TaskController.getAllTasks);
TaskRouter.get("/:id", TaskController.getTask);
TaskRouter.post("/", TaskController.addTask);
TaskRouter.delete("/:id",TaskController.deleteTask);
TaskRouter.patch("/:id",TaskController.UpdateTask);

export default TaskRouter;
