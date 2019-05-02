import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { PORT } from "./config";
import { errorHandler, trackingHandler } from "./helpers/middleware";

const app = express();

app.use(cors());
app.use(json({ limit: "50mb" }));
app.use(trackingHandler);

/* inject_routes */

app.use(errorHandler);

app.listen(PORT, () => console.log("App running"));
