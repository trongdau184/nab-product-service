import * as Hapi from "hapi";
import * as Joi from '@hapi/joi';
import iocContainer from "../config/IocConfig";
import IUserController from "./IUserController";
import TYPES from "../common/Types";
import * as UserValidator from "./UserValidator";
import * as UserResponse from "./UserResponse";

export default function (
    server: Hapi.Server,
  ) {
    const controller = iocContainer.get<IUserController>(TYPES.IUserController);
    server.bind(controller);

    server.route({
        method: "POST",
        path: "/users/login",
        options: {
          handler: controller.login,
          auth: false,
          tags: ["api", "users"],
          description: "Login",
          validate: {
            payload: UserValidator.loginValidator
          },
          plugins: {
            "hapi-swagger": {
              responses: {
                "200": {
                  description: "Login successfully",
                  schema: UserResponse.Token,
                },
                "401": {
                  description: "Invalid email or password"
                }
              }
            }
          }
        }
    });
  }