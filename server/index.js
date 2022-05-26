import express from 'express';
import cors from 'cors';
import searchRoute from "./routes/searchRoute.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

app.use("/search", searchRoute);

app.get('/', function (req, res) {
  res.send("welcome to REST api")
}).listen(PORT, function () { console.log(`Server Running on Port: http://localhost:${PORT}`) })
