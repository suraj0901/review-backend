import { Sequelize } from "sequelize";
import logger from "./logger.js";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
});

export default db;

export async function connect_database() {
  try {
    await db.authenticate();
    await sync_database();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:");
  }
}

export async function sync_database() {
  try {
    await db.sync();
    logger.info("Database synced successfully");
  } catch (error) {
    console.log(error);
    // logger.info(JSON.stringify(error));
    logger.error("Unable to sync database");
  }
}
