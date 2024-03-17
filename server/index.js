// imports
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

// Constants and variables
const app = express();
const mongodbUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 8083;
let dbClient;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connection to MongoDB
console.log("MongoDB URI:", mongodbUri);

MongoClient.connect(mongodbUri, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Connection failed for some reason:", error);
  }
  console.log("Connection established successfully");
  dbClient = client.db("crud"); // Get reference to the 'crud' database
  createCollection();
  app.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
  });
});

// Create 'todos' collection if it doesn't exist
function createCollection() {
  dbClient.createCollection("todos", function (err, res) {
    if (err) {
      console.log("Error creating collection:", err);
      return;
    }
    console.log("Collection 'todos' created!");
  });
}

// Test API endpoint
app.get("/test-api", (req, res) => {
  res.send("Hello, API is working fine");
});

// CRUD operations

app.post("/addTodo", (req, res) => {
  dbClient.collection("todos").insertOne(req.body, (err, info) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.json(info);
  });
});

app.get("/", (req, res) => {
  dbClient
    .collection("todos")
    .find()
    .toArray((err, items) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      res.send(items);
    });
});

app.get("/:id", (req, res) => {
  let id = req.params.id;
  dbClient
    .collection("todos")
    .find({ _id: ObjectId(id) })
    .toArray((err, items) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      res.send(items);
    });
});

app.put("/update/:id", (req, res) => {
  dbClient.collection("todos").findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        todo_description: req.body.todo_description,
        todo_responsible: req.body.todo_responsible,
        todo_priority: req.body.todo_priority,
        todo_complete: req.body.todo_complete,
      },
    },
    (err) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      res.send("Success updated!");
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  dbClient
    .collection("todos")
    .deleteOne({ _id: new ObjectId(req.params.id) }, (err) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      res.send("Success deleted!");
    });
});
