import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

var MONGODB_URI = "mongodb://root:example@mongo:27017";
const client = await MongoClient.connect(MONGODB_URI);
const db = client.db("kemi");
const collection = db.collection("tasks");

class TaskService {
    //GET /tasks
	static async getAllTasks() {
        const cursor = collection.find();
        const allTasks = await cursor.toArray();
        return allTasks;
	}
    //GET /tasks/:id
	static async getTask(id) {
        const cursor = collection.find({ _id: ObjectId.createFromHexString(id) });
        const tasks = await cursor.toArray();

        if (tasks.length == 0) {
            let err = new Error("No task found with id: " + id);
            err.code = 404;
            throw err;

        } else {
            return tasks[0];
        }
	}
    //POST /tasks/:id
    static async addTask(task){
        if (Object.keys(task).length != 0) {
            const result = await collection.insertOne(task);
            console.log("Task created: " + result.insertedId);
            return result.insertedId;
		} else {
            let err = new Error("Empty body");
            err.code = 400;
            throw err;
		}
    }
    //DELETE /tasks/:id
    static async deleteTask(id){
        const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
        if(result.deletedCount == 1){
            console.log("Task with id " + id + " deleted.");
            return result.deletedCount;
        }
        else{
            let err = new Error("No task found with id: " + id);
            err.code = 404;
            throw err;
        }
		
    }
    //PATCH /tasks/:id
    static async updateTask(id, updates) {
        var result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            {
                $set: updates 
            }
        )
        if (result.matchedCount === 1) {
            return result.matchedCount;
        } else {
            let err = new Error("No task found with id: " + id);
            err.code = 404;
            throw err;
        }
    }
}

export default TaskService;
