const express = require("express");
const router = express.Router();


const TaskController = require("../controllers/task.controller");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.addTask);

module.exports = router