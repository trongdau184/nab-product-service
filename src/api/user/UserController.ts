import IUserController from "./IUserController";

import * as Hapi from "hapi";
import * as Boom from "@hapi/boom";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import IUserService from "./IUserService";
import TYPES from "../common/Types";

@injectable()
export default class UserController implements IUserController {

    private service: IUserService;

    constructor(@inject(TYPES.IUserService) service: IUserService) {
        this.service = service;
    }

    public login(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        let email = request.payload["email"];
        let password = request.payload["password"];
        let token = this.service.login(email, password);
        if (token) {
            return h.response(token).code(200);
        } else {
            return Boom.unauthorized("Invalid email or password");
        }
    }
}