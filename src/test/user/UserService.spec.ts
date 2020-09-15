import IUserService from "../../api/user/IUserService";

import iocContainer from "../../api/config/IocConfig";
import TYPES from "../../api/common/Types";

describe("User Service", () => {
  beforeEach(() => {
    
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Login", async () => {
  
    const mockFunc = jest.fn();

    let service: IUserService = iocContainer.get<IUserService>(TYPES.IUserService);
    let result = service.login("test@test.com", "123456");
    
    expect(result).not.toBeNull();
  });
});