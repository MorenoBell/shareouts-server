const express = require('express')
const mongoose = require('mongoose')
const routes = require('./Router')
const cors = require('cors')
require('dotenv').config()
const app = express()
const uri = `mongodb+srv://morenobellini15:${process.env.MONGO_PW}@shareoutsdb.8jadq8f.mongodb.net/?retryWrites=true&w=majority`;

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('connected to mongodb');
  }
  catch (err) {
    console.error(err);
  }
}
connect();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'Content-Type' : 'multipart/form-data' ,* "
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(cors())
const port = 5000;
app.listen(port, () => console.log("server started on port" + port));
app.use(express.json())
app.use('', routes)
