const express = require('express');
const cors = require('cors');
const {MongoClient , ServerApiVersion, ObjectId} = require('mongodb')
require('dotenv').config();

const app = express();
const port = process.env.port || 10000;
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi : {
        version : ServerApiVersion.v1,
        strict : true ,
        deprecationErrors : true,
    }
});
async function run(){
    try{
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db("Swap");

    }catch(err){
        console.error("Error connecting to MMongoDB : ", err);
    }
}
run().catch(console.dir)
app.listen(port, () => {
    console.log("Server is running on port : ", port)
})
