import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import Swagger from './plugins/swagger';
import * as Products from "./api/product";
import * as Users from "./api/user";
import QueryParser from "./plugins/QueryParser";
import JwtAuth from './plugins/JwtAuth';
import Good from './plugins/Good';
import { IServerConfigurations } from "./configurations";
//import { IDatabase } from "./database";

export async function init(
  configs: IServerConfigurations,
  //database: IDatabase
): Promise<Hapi.Server> {
  try {
    const port = process.env.PORT || configs.port;
    const server = new Hapi.Server({
      debug: { request: ['error'] },
      port: port,
      routes: {
        cors: {
          origin: ["*"]
        }
      }
    });

    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }

    //  Setup Hapi Plugins
    // const plugins: Array<string> = configs.plugins;
    // const pluginOptions = {
    //   //database: database,
    //   serverConfigs: configs
    // };

    const plugins: any[] = [
      Inert,
      Vision,
      Swagger,
      Good,
      QueryParser,
      JwtAuth,
    ];
    await server.register(plugins);

    console.log("Register Routes");
    //Logs.init(server, configs, database);
    Products.init(server);
    Users.init(server);
    //Users.init(server, configs, database);
    console.log("Routes registered successfully.");

    return server;
  } catch (err) {
    console.log("Error starting server: ", err);
    throw err;
  }
}
