import  TaskWorker  from "../workers/task.worker.js";
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
		var job = await myQueue.add('deleteTask', {id})
        activeJobs[job.id] = {
            job,
            res
        }			
    }
	static async UpdateTask(req, res) {
        var id = req.params.id;
        var updates = req.body;
		var job = await myQueue.add('updateTask', {id, updates})
        activeJobs[job.id] = {
            job,
            res
        }
    }
}
TaskWorker.on('completed', (job, returnvalue) => {
    console.log("job completed:" + job.id)
    var res = activeJobs[job.id].res;
    try{
        if(!returnvalue.error){
            if (job.name == "getAllTasks")
                res.status(200).send(returnvalue);
            else if(job.name == "getTask")
                res.status(200).send(returnvalue);
            else if (job.name == "addTask")
                res.status(201).send(returnvalue.toString());
            else if (job.name == "deleteTask")
                res.status(204).send(returnvalue.toString());
            else if (job.name == "updateTask")
                res.status(200).send(returnvalue.toString());
        }
        else{
            let statuscode = 500;
            if(returnvalue.error_code)
                statuscode = returnvalue.error_code;
            res.status(statuscode).send(returnvalue.error_message.toString());
        }
    } 
    catch(err){
        res.status(500).send(err)
    }   

});
export default TaskController;
