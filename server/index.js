// imports
// 3rd party module
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
//core module
const bodyParser = require("body-parser");

// constand and variable
const app = express();
const connectionString =
  "mongodb+srv://swapnil:swapnil321@cluster0.jutckhu.mongodb.net/";
const PORT = 8083;
let dbClient; // db connection save


app.get('/test-api',function (req,res){
    res.send('HEllo api is working fine')
})

// midlle ware express
app.use(cors()); // cross origin resource sharing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // request body params (encode it and read in form of body)
app.use(bodyParser.json());





// connection to mongo db
//params
// 1 url or connection string mongodb://localhost:27017
// 2 { useNewUrlParser: true }, allow users to fall back to the old parser if they find a bug in the new parser.
// 3  callback  (err, client)
// err if some issue with connection (mongodb not installed or start)
// console.log("Connection established - All well");
// save connection in the variable dbClient
// start the server in callback
MongoClient.connect(
    connectionString,
    { useNewUrlParser: true },
    (error, client) => {
        if (error) {
            return console.log("Connection failed for some reason");
        }
        console.log("Connection established - All well");
        dbClient = client.db("crud"); // creating or using old db
        app.listen(PORT, function () {
            console.log("Server is running on Port: " + PORT);
        });
    },
);




//create
app.post('/addTodo', function (req, res) {
    // validate if you know js
    // Object.keys // kaeys are validate or not
    // for every api u have to do
    console.log(req.body)
    dbClient.collection("todos").insertOne(req.body, function (err, info) {
        if (err) {
            res.status(400).send(err);
        }
        res.json(info);
    });
})


// read
app.get('/', function (req, res) {
    dbClient.collection("todos")
        .find()
        .toArray(function (err, items) {
            if (err) {
                res.status(400).send(err);
            }
            res.send(items);
        });
})


app.get("/:id", function (req, res) {
  let id = req.params.id;
  console.log(id)
  dbClient
    .collection("todos")
    .find({ _id: ObjectId(id) })
    .toArray(function (err, items) {
      res.send(items);
    });
});




//update
app.put('/update/:id', function (req, res) {
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
        function () {
            res.send("Success updated!");
        },
    );
})


app.delete('/delete/:id', function (req, res) {
    dbClient.collection("todos").deleteOne(
        { _id: new ObjectId(req.params.id) },
        function () {
            res.send("Success deleted!");
        },
        );
    })

// app.delete('/delete/:id',function(req,res){
//     dbClient.collection("todos")
//     .deleteOne({id: new ObjectId(req.params.id)},
//     function(){
//         res.send("Deleted Successfully")
//     })
// })