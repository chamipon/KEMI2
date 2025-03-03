import { Worker } from "bullmq";
import IORedis from 'ioredis';
import TaskService  from "../services/task.service.js";

const REDIS_PORT = process.env.RESIS_PORT || 6379;

const redisConnection = new IORedis(REDIS_PORT,"cache://cache", 
    {maxRetriesPerRequest: null}
);

const TaskWorker = new Worker(
    'taskQueue',
    async job => {
        try{
            if (job.name == "getAllTasks")
                return await TaskService.getAllTasks();
            else if(job.name == "getTask")
                return await TaskService.getTask(job.data.id);
            else if (job.name == "addTask")
                return await TaskService.addTask(job.data.task);
            else if (job.name == "deleteTask")
                return await TaskService.deleteTask(job.data.id);
            else if (job.name == "updateTask")
                return await TaskService.updateTask(job.data.id, job.data.updates);
        }
        catch (err){
            console.error(err)
            //Return the error and proper status code so we can properly report the error.
            return {
                error:true,
                error_message: err,
                error_code: err.code
            };
        }
    },
    { connection: redisConnection},
  );

  export default TaskWorker;