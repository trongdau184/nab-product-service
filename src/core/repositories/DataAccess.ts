import * as mongoose from "mongoose";
import * as _ from "lodash";
import { NODE_ENV } from "../common/Constants";
import { IDataConfiguration } from "../../configurations";

class DataAccess {
    static mongooseConnection: mongoose.Connection;

    static connect(config: IDataConfiguration) {
        new Promise<void>((resolve, reject) => {
            let connectionString = process.env.DB_CONNECTION_STRING || config.connectionString;

            DataAccess.mongooseConnection = mongoose.connection;

            /**
             * @description Using to re-connect where there is a problem at the first connect.
             * @returns {MongooseThenable}
             */
            let connectWithRetry = () => {
                let connectOptions = {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true};
                mongoose.connect(connectionString, connectOptions);
            };

            this.mongooseConnection.on('connected', () => {
                console.log("Connect to database successfully");
                resolve();
            });

            this.mongooseConnection.on('error', (err) => {
                console.log("Error when connecting to database", err);
                reject(err);
            });

            this.mongooseConnection.on('disconnected', () => {
                console.log('Database connection disconnected');

                if (process.env.NODE_ENV !== NODE_ENV.DEV) {
                    connectWithRetry();
                }
            });

            process.on('SIGTERM', () => {
                DataAccess.mongooseConnection.close(() => {
                    console.log('Database connection disconnected through app termination');
                    process.exit(0);
                });
            });

            connectWithRetry();
        });
    }
}

export = DataAccess;
