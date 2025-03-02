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
	
}

export default TaskService;
