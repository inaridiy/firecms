export interface UserCredentialProps {
  id: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserCredential {
  get props() {
    return this._props;
  }

  constructor(private readonly _props: UserCredentialProps) {}

  private static async hashPassword(password: string) {
    const encodedPassword = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", encodedPassword);
    const hexHash = [...new Uint8Array(hash)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hexHash;
  }

  static async create(data: { id: string; password: string }) {
    if (data.password.length < 8) throw new Error("Password too short");
    const hexHash = await UserCredential.hashPassword(data.password);
    return new UserCredential({ id: data.id, passwordHash: hexHash });
  }

  async login(data: { password: string }) {
    const hexHash = await UserCredential.hashPassword(data.password);
    if (this.props.passwordHash !== hexHash)
      throw new Error("Invalid password");
  }
}
