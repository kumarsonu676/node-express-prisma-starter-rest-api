import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as path from "path";
import routes from "./routes/index.routes";

// Load environment variables
dotenv.config();

const app = express();

//setup public directory
app.use(express.static(path.join(__dirname, "public")));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//setup cors
app.use(cors());

app.use("/api", routes);

export default app;
