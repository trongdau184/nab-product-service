import * as Hapi from "hapi";

const register = async (
  server: Hapi.Server,
  options
): Promise<void> => {
  try {
    const validateUser = async (decoded: any, request, response) => {
        // For Demo purpose, alway return true.
        return { isValid: true };
    };

    await server.register(require("hapi-auth-jwt2"));

    return setAuthStrategy(server, {
      config: options,
      validate: validateUser
    });
  } catch (err) {
    console.log(`Error registering jwt plugin: ${err}`);
    throw err;
  }
};

const setAuthStrategy = async (server, { config, validate }) => {
  server.auth.strategy("jwt", "jwt", {
    key: "random-secret-password",
    validate,
    verifyOptions: {
      algorithms: ["HS256"]
    }
  });

  server.auth.default("jwt");

  return;
};

const JwtAuth: Hapi.Plugin<{}> = {
    name: "JWT Authentication",
    version: "1.0.0",
    register,
};

export default JwtAuth;
