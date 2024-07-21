import app from "./app.js";
import { connect_database, sync_database } from "./config/db.js";
import { port } from "./config/env.js";
import { logger } from "./config/logger.js";

let server;

connect_database().then(() => {
  server = app.listen(port, () => {
    logger.info(`Listening to port ${port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
