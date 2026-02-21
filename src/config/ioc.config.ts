import { Container } from "inversify";
import { TYPES } from "./ioc.types";

import { HealthController } from "../controllers/health.controller";

const container = new Container();

container.bind<HealthController>(TYPES.HealthController).to(HealthController);

export default container;
