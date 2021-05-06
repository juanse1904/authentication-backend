const express = require("express")
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");


if (process.env.NODE_ENV !== "production"){
    dotenv.config();
}

const app = express()

//conexión a base de datos
MongoClient.connect(
    process.env.DB_URI, //databaseUri
    {wtimeout: 2500, poolSize: 50, useNewUrlParser: true,  useUnifiedTopology: true, replicaSet: 'rs'  } //writeConcern, poolMaximo
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await user.injectdb(client);
    await posts.injectdb(client);
    
  
    console.log("connected")
    app.listen( process.env.PORT || 8080, () =>{
      console.log(`the server starts at http://localhost:${process.env.PORT}`);
  })
}) 

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

  app.get("/", (request, response) => {
  response.json({ info: "Stam Suite Administration Module service is running..." });
  });

  //Routes app.use 
 /*  app.use(userRoutes);
  app.use(postsRoutes); */

  app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that!");
  });