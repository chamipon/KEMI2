import { Worker } from "bullmq";
import IORedis from 'ioredis';
import  TaskService  from "../services/task.service.js";

const redisConnection = new IORedis("6379","cache://cache", 
    {maxRetriesPerRequest: null}
);


const TaskWorker = new Worker(
    'taskQueue',
    async job => {
        try{
            if (job.name == "getAllTasks"){
                return await TaskService.getAllTasks();
            }
            if(job.name == "getTask")
                return await TaskService.getTask(job.data.id);
        }
        catch (err){
            return err;
        }
    },
    { connection: redisConnection},
  );

  export default TaskWorker;