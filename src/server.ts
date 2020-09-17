import * as Hapi from 'hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import Swagger from './plugins/swagger';
import * as Products from './api/product';
import * as Users from './api/user';
import QueryParser from './plugins/QueryParser';
import JwtAuth from './plugins/JwtAuth';
import Good from './plugins/Good';
import RequestWrapper from './plugins/RequestWrapper';
import { IServerConfigurations } from './configurations';

export async function init(
    configs: IServerConfigurations
): Promise<Hapi.Server> {
    try {
        const port = process.env.PORT || configs.port;
        const server = new Hapi.Server({
            debug: { request: ['error'] },
            port: port,
            routes: {
                cors: {
                    origin: ['*']
                }
            }
        });

        if (configs.routePrefix) {
            server.realm.modifiers.route.prefix = configs.routePrefix;
        }

        const plugins: any[] = [
            Inert,
            Vision,
            Swagger,
            Good,
            QueryParser,
            JwtAuth,
            RequestWrapper
        ];
        await server.register(plugins);

        console.log('Register Routes');
        Products.init(server);
        Users.init(server);
        console.log('Routes registered successfully.');

        return server;
    } catch (err) {
        console.log('Error starting server: ', err);
        throw err;
    }
}
