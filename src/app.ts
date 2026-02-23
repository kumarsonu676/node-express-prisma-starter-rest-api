import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as path from "path";
import routes from "./routes/index.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { NotFoundError } from "./utils/errors";

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(requestIdMiddleware);

app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Route ${req.method} ${req.url} not found`);
    next(error);
});

app.use(errorMiddleware);

export default app;
