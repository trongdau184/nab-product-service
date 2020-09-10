import * as Server from "./server";
import * as Configs from "./configurations";
import DataAccess = require("./core/repositories/DataAccess");

console.log(`Running environment ${process.env.NODE_ENV || "dev"}`);

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});

// Define async start function
const start = async () => {
  try {
    // Init Database
    const dbConfigs = Configs.getDatabaseConfig();
    await DataAccess.connect(dbConfigs);

    // Starting Application Server
    const serverConfigs = Configs.getServerConfigs();

    //const server = await Server.init(config, db);
    const server = await Server.init(serverConfigs);
    await server.start();
    console.log(`server started at ${server.info.host}:${server.info.port}`);
  } catch (err) {
    console.error("Error starting server: ", err.message);
    throw err;
  }
};

// Start the server
//start({ config: serverConfigs, db: database });
start();
