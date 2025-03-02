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
                throw new Error("No task found with id: " + id)
			} else {
				return tasks[0];
			}
		} catch (err) {
			console.error("Error executing query", err);

		}			

	}
    static async addTask(task){
        if (task) {
			try {
				const result = await collection.insertOne(task);
				console.log("Task created: " + result.insertedId);
                return result.insertedId;

			} catch(err) {
				console.error("Error executing query", err);
                return err
			}
		} else {
            console.error("Invalid request body");
            throw new Error("Invalid request body");
			
		}
    }
}

export default TaskService;
