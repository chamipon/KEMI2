import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

var MONGODB_URI = "mongodb://root:example@mongo:27017";
const client = await MongoClient.connect(MONGODB_URI);
const db = client.db("kemi");
const collection = db.collection("tasks");

class TaskController {
	static async getAllTasks(req, res) {
		try {
            const cursor = collection.find();
			const allTasks = await cursor.toArray();
			res.status(200).send(allTasks);
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	}
	static async getTask(req, res) {
		var id = req.params.id;
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
	static async addTask(req, res) {
		var task = req.body;
		if (task) {
			try {
				const db = client.db("kemi");
				const collection = db.collection("tasks");

				const result = await collection.insertOne(task);
				console.log("Task created: " + result.insertedId);
				res.status(201).send(result.insertedId);
			} catch {
				console.error("Error executing query", err);
				res.status(500).send(err);
			}
		} else {
			res.status(400).send("Invalid request body");
			console.error("Invalid request");
		}
	}
    static async deleteTask(req, res){
        var id = req.params.id;
		try {
			const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
            if(result.deletedCount == 1){
                console.log("Task with id " + id + " deleted.");
                res.status(204).send();
            }
			else{
                res.status(404).send("Task not found with id " + id)
            }
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}			
    }
	static async UpdateTask(req, res) {
        var id = req.params.id;
        var updates = req.body;
        try{
            
            const db = client.db("kemi");
            const collection = db.collection("tasks");

            const result = await collection.updateOne(
                { _id: ObjectId.createFromHexString(id) },
                {
                     $set: updates 
                }
            )
            if (result.matchedCount === 1) {
                res.status(200).send('Task updated');
              } else {
                res.status(404).send("Task not found with id " + id)
              }
        }
        catch(err){
            console.error("Error executing query", err);
			res.status(500).send(err);
        }
    }
}

export default TaskController;
