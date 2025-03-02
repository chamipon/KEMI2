import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import  TaskService  from "../services/task.service.js";
import  TaskWorker  from "../workers/task.worker.js";

var MONGODB_URI = "mongodb://root:example@mongo:27017";
const client = await MongoClient.connect(MONGODB_URI);
const db = client.db("kemi");
const collection = db.collection("tasks");

import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisConnection = new IORedis("6379","cache://cache", 
    {maxRetriesPerRequest: null}
);
const myQueue = new Queue('taskQueue', {
    connection: redisConnection,
});

var activeJobs = {};

class TaskController {
	static async getAllTasks(req, res) {
        var job = await myQueue.add('getAllTasks')
        activeJobs[job.id] = {
            job,
            res
        }
	}
	static async getTask(req, res) {
		var id = req.params.id;
		var job = await myQueue.add('getTask', {id})
        activeJobs[job.id] = {
            job,
            res
        }		
	}
	static async addTask(req, res) {
		var task = req.body;
		var job = await myQueue.add('addTask', {task})
        activeJobs[job.id] = {
            job,
            res
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
TaskWorker.on('completed', (job, returnvalue) => {
    console.log("job completed:" + job.id)
    var res = activeJobs[job.id].res;    
    if(returnvalue){
        if (job.name == "getAllTasks")
            res.status(200).send(returnvalue);
        else if(job.name == "getTask")
            res.status(200).send(returnvalue);
        else if (job.name == "addTask")
            res.status(201).send(returnvalue)
    }
    else{
        res.status(500)
    }
});
export default TaskController;
