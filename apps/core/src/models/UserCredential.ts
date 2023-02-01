export interface UserCredentialProps {
  id: string;
  password_hash: string;
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
    const hexHash = await UserCredential.hashPassword(data.password);
    return new UserCredential({ id: data.id, password_hash: hexHash });
  }

  async login(data: { id: string; password: string }) {
    const hexHash = await UserCredential.hashPassword(data.password);
    return this.props.id === data.id && this.props.password_hash === hexHash;
  }
}
