import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show an user profile", async () => {
    const user: ICreateUserDTO = {
      name: "User",
      email: "user@test.com",
      password: "12345"
    };

    const createdUser = await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(createdUser).toHaveProperty("id");

    const result = await showUserProfileUseCase.execute(createdUser.id as string);

    expect(result.name).toEqual(user.name);
    expect(result.email).toEqual(user.email);


  });

  it("should not be able to list un-existing user's profile", async () => {
    expect(async () => {
      const user_id = "abc12123231231"
      await showUserProfileUseCase.execute(user_id)
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
