const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/task.controller");

router.get("/", TaskController.getAllTasks);
router.get("/:id", TaskController.getTask);
router.post("/", TaskController.addTask);
router.delete("/:id",TaskController.deleteTask);
router.patch("/:id",TaskController.UpdateTask);

module.exports = router;
