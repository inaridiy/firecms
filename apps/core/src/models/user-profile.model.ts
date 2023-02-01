export interface UserProfileProps {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserProfile {
  get props(): UserProfileProps {
    return this._props;
  }

  constructor(private _props: UserProfileProps) {
    if (!this._props.email.match(/.+@.+\..+/)) throw new Error("Invalid email");
  }

  static create(props: UserProfileProps): UserProfile {
    return new UserProfile(props);
  }
}
