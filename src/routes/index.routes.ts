import express from "express";
import healthRouter from "../modules/health/health.routes";
import docsRouter from "./docs.routes";
import authRouter from "../modules/auth/auth.routes";

const routes = express.Router();

routes.use("/health", healthRouter);
routes.use("/docs", docsRouter);
routes.use("/auth", authRouter);

export default routes;
