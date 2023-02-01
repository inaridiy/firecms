export interface Database {
  user_credentials: {
    id: string;
    password_hash: string;
    password_expiration: Date;
  };
  user_profile: {
    user_id: string;
    name: string;
    email: string;
  };
}
