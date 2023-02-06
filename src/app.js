import cors from "cors";
import express from "express";

import { controllers } from "./controller/controllers.js";
import { models } from "./model/models.js";

const app = express()
app.use(cors())
app.use(express.json())

models.forEach( model => model.init() );
controllers.forEach( controller => controller.routes(app) );

export default app