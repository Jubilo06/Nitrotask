import serverless from "serverless-http";
import app from "../../backend/src/index.mjs";

export const handler = serverless(app);
