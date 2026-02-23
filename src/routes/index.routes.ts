import express from "express";
import healthRouter from "./health.routes";
import docsRouter from "./docs.routes";

const routes = express.Router();

routes.use("/health", healthRouter);
routes.use("/docs", docsRouter);

export default routes;
