import { createNamespace } from "cls-hooked";
import { Sequelize } from "sequelize";
import { createAdmin } from "../app/user/user.model.js";
import { logger } from "./logger.js";
import { env } from "./env.js";

const namespace = createNamespace("performance");
Sequelize.useCLS(namespace);

export const db = new Sequelize({
  dialect: "sqlite",
  storage: "sqlite.db",
});

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
    if (env === "development") await createAdmin();
    // await createQuestions();
    logger.info("Database synced successfully");
  } catch (error) {
    console.log(error);
    // logger.info(JSON.stringify(error));
    logger.error("Unable to sync database");
  }
}
