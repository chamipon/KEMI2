import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

var MONGODB_URI = "mongodb://root:example@mongo:27017";
const client = await MongoClient.connect(MONGODB_URI);
const db = client.db("kemi");
const collection = db.collection("tasks");

class TaskService {
	static async getAllTasks() {
		try {
            const cursor = collection.find();
			const allTasks = await cursor.toArray();
            return allTasks;
		} catch (err) {
			console.error("Error executing query", err);
            return err;
		}
	}
	static async getTask(id) {
		try {
			const cursor = collection.find({ _id: ObjectId.createFromHexString(id) });
			const tasks = await cursor.toArray();

			if (tasks.length == 0) {
				res.status(404).send("No task found with id " + id);
				console.log("No task found with id " + id);
			} else {
				console.log(tasks[0]);
				res.status(200).send(tasks[0]);
			}
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}			

	}
}

export default TaskService;
