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
            throw new Error(err);
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
            throw new Error(err);
		}			

	}
    static async addTask(task){
        if (task) {
			try {
				const result = await collection.insertOne(task);
				console.log("Task created: " + result.insertedId);
                return result.insertedId;

			} catch(err) {
				throw new Error(err);
			}
		} else {
            throw new Error(err);
			
		}
    }
    static async deleteTask(id){
        try {
            const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
            if(result.deletedCount == 1){
                console.log("Task with id " + id + " deleted.");
                return result.deletedCount;
            }
            else{
                let err = "Task not found with id " + id;
                throw new Error(err);
                
            }
        } catch (err) {
            throw new Error(err);
        }			
    }
    static async updateTask(id, updates) {
            try{
                const result = await collection.updateOne(
                    { _id: ObjectId.createFromHexString(id) },
                    {
                         $set: updates 
                    }
                )
                if (result.matchedCount === 1) {
                    return result.matchedCount;
                  } else {
                    throw new Error("Task not found with id: " + id);
                  }
            }
            catch(err){
                throw new Error("Task not found with id: " + id);
            }
        }
}

export default TaskService;
