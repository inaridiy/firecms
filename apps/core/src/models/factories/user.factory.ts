import { UserCredential } from "../user-credential.model";
import { UserProfile } from "../user-profile.model";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export class UserFactory {
  static async createUser(data: CreateUserData) {
    const id = crypto.randomUUID();
    const credential = await UserCredential.create({
      id,
      password: data.password,
    });
    const profile = UserProfile.create({
      id,
      name: data.name,
      email: data.email,
    });
    return { credential, profile };
  }
}
