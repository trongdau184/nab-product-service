import IUserService from "./IUserService";

import "reflect-metadata";
import { injectable, inject } from "inversify";
import { v4 as uuidv4 } from 'uuid'
import * as Jwt from "jsonwebtoken";

@injectable()
export default class UserService implements IUserService {

    constructor() {

    }

    public login(email: string, password: string) {
        // For demo purpose, don't check email and password, just return the token.
        let user = {id: uuidv4()};
        return { token: this.generateToken(user) };
    }

    private generateToken(user) {
        const jwtSecret = "random-secret-password";
        const jwtExpiration = "1h";
        const payload = { id: user.id };
    
        return Jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
      }
}