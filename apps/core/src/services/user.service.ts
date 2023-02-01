import { Jwt } from "hono/utils/jwt";
import { UserFactory } from "../models/factories/user.factory";
import { UserCredentialRepository } from "../repositories/user-credential.repository";
import { UserProfileRepository } from "../repositories/user-profile.repository";

export interface UserServiceInjections {
  db: D1Database;
  secret: string;
}

export class UserService {
  private readonly credentialRepo: UserCredentialRepository;
  private readonly profileRepo: UserProfileRepository;

  constructor(private inject: UserServiceInjections) {
    const repoInjections = {
      db: inject.db,
    };
    this.credentialRepo = new UserCredentialRepository(repoInjections);
    this.profileRepo = new UserProfileRepository(repoInjections);
  }

  async createUser(user: { name: string; email: string; password: string }) {
    const { profile, credential } = await UserFactory.createUser(user);

    await this.credentialRepo.create(credential);
    await this.profileRepo.create(profile);

    //TODO: Refresh token
    const token = await Jwt.sign(
      {
        user_id: credential.props.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, //1 week
      },
      this.inject.secret
    );

    return {
      id: profile.props.id,
      name: profile.props.name,
      email: profile.props.email,
      token,
    };
  }
}
