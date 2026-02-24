const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config();

const app = express();
const port = process.env.port || 10000;
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db("Swap");
        const userCollection = db.collection("users")
        app.get("/", (req, res) => {
            res.send("Server is running")
        })
        app.post("/users", async (req, res) => {
            const user = req.body;
            try {
                const result = await userCollection.insertOne(user);
                res.status(201).json({ message: "User created successfully", result })
            } catch (err) {
                res.status(500).json({ message: "Failed to create user", error: err.message })
            }
        })
        app.get("/users", async (req, res) => {
            try {
                const user = await userCollection.find().toArray();
                res.status(200).json({ massage: "User fetched successfully", user })
            } catch (err) {
                res.status(500).json({ message: "Failed to fetch user", error: err.message })
            }
        })
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            try {
                const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    return res.status(404).json({ massage: "user not found " })
                }
                res.status(200).json({ massage: "User deleted successfully", result })
            } catch (err) {
                res.status(500).json({ message: "Failed to delete user", error: err.message })
            }
        })
        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            try {
                const result = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
                if (result.matchedCount === 0) {
                    res.status(400).json({ massage: "not found" })
                }
                res.status(200).json({ massage: "User updated successfully", result })
            } catch (err) {
                res.status(500).json({ massage: " Failed to update data ", error: err.message })
            }
        })
    } catch (err) {
        console.error("Error connecting to MMongoDB : ", err);
    }
}
run().catch(console.dir)
app.listen(port, () => {
    console.log("Server is running on port : ", port)
})
