const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cenr.mongodb.net/recipe-book?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("food-recipe");
    const allFoodCollection = database.collection("allFood");
    const adminCollection = database.collection("admin");

    //food Get Api
    app.get("/allFood", async (req, res) => {
      const cursor = allFoodCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //food POST Api
    app.post("/allFood", async (req, res) => {
      const allFood = req.body;
      const result = await allFoodCollection.insertOne(allFood);
      res.json(result);
    });

    //admin Get Api
    app.get("/admin", async (req, res) => {
      const cursor = adminCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // admin post Api
    app.post("/admin", async (req, res) => {
      const admin = req.body;
      console.log(admin)
      const result = await adminCollection.insertOne(admin);
      res.json(result);
    });
  } catch {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("In the name of Allah");
});

app.listen(port, () => {
  console.log(`Server running is ${port}`);
});
