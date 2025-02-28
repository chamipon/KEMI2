const { MongoClient } = require("mongodb");
var MONGODB_URI="mongodb://root:example@mongo:27017"
const client = new MongoClient(MONGODB_URI);

class TaskController{
    static client;
    TaskController(mongoClient){
        client = mongoClient;
    }
    static async getAllTasks(req,res){
        try{
            await client.connect();
            const db = client.db("kemi");
            const collection = db.collection("tasks");
        
            const cursor = collection.find();
            const allTasks = await cursor.toArray();
            res.status(200).send(allTasks);
            
        }
        catch(err){
            console.error("Error executing query", err)
            res.status(500).send(err);
        }
        finally{
            await client.close();
        }
    }
    static async addTask(req,res){
        var task = req.body;

        if(task){
            try{
                await client.connect();
                const db = client.db("kemi");
                const collection = db.collection("tasks");

                const result = await collection.insertOne(task);
                console.log("Task created: " + result.insertedId)
                res.status(201).send(result.insertedId);
            }
            catch{
                console.error("Error executing query", err)
                res.status(500).send(err);
            }
            finally{
                await client.close();
            }
        }
        else{
            res.status(400).send("Invalid request body");
            console.error("Invalid request")
        }
    }
}

module.exports = TaskController