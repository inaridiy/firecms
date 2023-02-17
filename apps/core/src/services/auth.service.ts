import { Jwt } from "hono/utils/jwt";
import { UserCredentialRepository } from "../repositories/user-credential.repository";

export interface AuthServiceInjections {
  db: D1Database;
  secret: string;
}

export type LoginData =
  | {
      user_id: string;
      password: string;
    }
  | {
      email: string;
      password: string;
    }
  | {
      name: string;
      password: string;
    };

export class AuthService {
  private readonly credentialRepo: UserCredentialRepository;

  constructor(private inject: AuthServiceInjections) {
    this.credentialRepo = new UserCredentialRepository({
      db: inject.db,
    });
  }

  async login(data: LoginData) {
    const credential =
      "user_id" in data
        ? await this.credentialRepo.findCredentialByUserId(data.user_id)
        : "email" in data
        ? await this.credentialRepo.findCredentialByUserEmail(data.email)
        : "name" in data
        ? await this.credentialRepo.findCredentialByUserName(data.name)
        : undefined;

    if (!credential) throw new Error("invalid_credentials");
    await credential.login(data);

    //TODO: Refresh token
    const token = await Jwt.sign(
      {
        user_id: credential.props.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, //1 week
      },
      this.inject.secret
    );

    return { token, id: credential.props.id };
  }
}
