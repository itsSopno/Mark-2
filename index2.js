const express = require('express')
const cors = require('cors')
const {MongoClient , ServerApiVersion ,ObjectId} = require('mongodb')
require('dotenv').config()
const app = express();
const port = 2000 ;
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI
const client = new MongoClient(uri , {
    serverApi : {
        version :ServerApiVersion.v1,
        strict : true,
        deprecationErrors : true ,
        
    }
})

async function run (){
try{
    await client.connect();
    console.log("server is connected to MongoDB")
    const db = client.db("For");
const userCollection = db.collection("users")
const dataCollection  = db.collection("data")

app.get("/", (req , res) => {
    res.send("server is running")
})

app.post("/users",async(req,res) => {
    const user = req.body;
try{
    const result = await userCollection.insertOne(user);
    res.status(201).send({error : false , message : "user created successfully" , data : result})
}catch(err){
    res.status(500).send({error : true , message : "failed to create user" , data : null})
}
})

app.get("/users", async(req, res) => {
    try{
        const users = await userCollection.find().toArray();
        res.status(200).send({error : false , message : "users retrieved successfully" , data : users})
    }catch(err){
        res.status(500).send({error : true , message : "failed to retrieve users" , data : null})
    }
})
app.post("/data" , async (req , res ) => {
    const data = req.body;
    try{
        const result = await dataCollection.insertOne(data);
        res.status(201).send({error : false , message : "data created successfully" , data : result})
    }catch(err){
        res.status(500).send({error : true , message : "failed to create data" , data : null})
    }
})
app.get("/data" , async(req, res ) => {
    try{
        const result = await dataCollection.find().toArray();
        res.status(200).send({error : false , message : "data retrieved successfully" , data : result})
    }catch(err){
        res.status(500).send({error : true , message : "failed to retrieve data" , data : null})
    }
})


}catch(err){
    console.error("Error connecting to MongoDB : ", err);
}
}
run().catch(console.dir)

app.listen(port , () => {
    console.log("server is running on port : ", port)
})