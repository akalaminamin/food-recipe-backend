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
    const favouriteCollection = database.collection("favourite");

    //food Get Api
    app.get("/allFood", async (req, res) => {
      const cursor = allFoodCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // favourite post api
    app.post("/favourite", async(req, res)=>{
      const favourites = req.body;    
      console.log(favourites)
      const result = await favouriteCollection.insertOne(favourites)
      res.json(result)
    })       

    // favourite get api
    app.get("/favourite", async (req, res) => {
      const favourite = favouriteCollection.find({});           
      const result = await favourite.toArray();     
      res.send(result);    
    });

    // food single data get api
    app.get("/allFood/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await allFoodCollection.findOne(filter);
      console.log(result);
      res.json(result);
    });

    //food POST Api
    app.post("/allFood", async (req, res) => {
      const allFood = req.body;
      const result = await allFoodCollection.insertOne(allFood);
      res.json(result);
    });

    //food put Api
    app.put("/allFood/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };  
      const status = req.body.status;
      const options = { upset: true };  
      const updateStatus = { 
        $set: {
          status: status,
        },
      };
      const result = await allFoodCollection.updateOne(
        filter,
        updateStatus,
        options
      );
      res.json(result);
    });

    app.put("/allFood/addRecipe/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateData = req.body;
      const options = { upset: true };
      const updateDoc = {
        $set: {
          name: updateData.name,
          email: updateData.email,
          recipeName: updateData.recipeName,
          cusine: updateData.cusine,
          category: updateData.category,
          author: updateData.author,
          method: updateData.method,
          ingredients: updateData.ingredients,
          recipeImage: updateData.recipeImage,
          status: updateData.status, 
        },
      };
      console.log(updateDoc)
      const result = await allFoodCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });

    // delete favourite api
    app.delete("/allFood/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await allFoodCollection.deleteOne(filter);
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
      console.log(admin);
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
