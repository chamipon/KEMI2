import  TaskWorker  from "../workers/task.worker.js";
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_PORT = process.env.RESIS_PORT || 6379;

//Open redis connection
const redisConnection = new IORedis(REDIS_PORT,"cache://cache", 
    {maxRetriesPerRequest: null}
);
//Create queue for tasks 
const taskQueue = new Queue('taskQueue', {
    connection: redisConnection,
});

//Used to store active jobs with their response object.
//This allows us to send responses back to the requester
var activeJobs = {};

class TaskController {
    //GET /tasks
	static async getAllTasks(req, res) {
        var job = await taskQueue.add('getAllTasks')
        activeJobs[job.id] = {
            job,
            res
        }
	}
    //GET /tasks/:id
	static async getTask(req, res) {
		var id = req.params.id;
		var job = await taskQueue.add('getTask', {id})
        activeJobs[job.id] = {
            job,
            res
        }		
	}
    //POST /tasks/:id
	static async addTask(req, res) {
		var task = req.body;
		var job = await taskQueue.add('addTask', {task})
        activeJobs[job.id] = {
            job,
            res
        }
	}
    //DELETE /tasks/:id
    static async deleteTask(req, res){
        var id = req.params.id;
		var job = await taskQueue.add('deleteTask', {id})
        activeJobs[job.id] = {
            job,
            res
        }			
    }
    //PATCH /tasks/:id
	static async UpdateTask(req, res) {
        var id = req.params.id;
        var updates = req.body;
		var job = await taskQueue.add('updateTask', {id, updates})
        activeJobs[job.id] = {
            job,
            res
        }
    }
}

//Fires when a job is completed.
TaskWorker.on('completed', (job, returnvalue) => {
    console.log("job completed:" + job.id)
    var res = activeJobs[job.id].res;
    //Send response based on what type of job this was
    try{
        //The worker sets an error value if an error was caught executing the job.
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
