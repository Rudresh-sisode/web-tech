import { debug } from "util";
import app from "./app";
import http from "http";

import {connectDb} from "./utils/connectDb";

require('dotenv').config();



function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};


const onListening = (): void => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);


connectDb()
  .then(() => {
    console.log("Connected to the database");
    console.log("\n***************************************");
    console.log(`***\tserver port ${port}\t*******`);
    server.listen(port);
    console.info("***\tserver successfully started! **");
    console.log("***************************************");
  })
  .catch((error: any) => {
    console.log("Error connecting to the database", error.message);
  });

//handle unhandled exceptions
process.on("unhandledRejection", (err: any) => {
  console.log("Unhandled Rejection", err);
  process.exit(1);
});




