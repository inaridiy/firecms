import { APIKey } from "../models/api-key.model";
import { APIKeyRepository } from "../repositories/api-key.repository";

export interface APIKeyServiceInjections {
  db: D1Database;
}

export interface CreateAPIKeyData {
  name: string;
  permissions: Record<string, string>;
}

export class APIKeyService {
  private apiKeyRepo: APIKeyRepository;

  constructor(inject: APIKeyServiceInjections) {
    this.apiKeyRepo = new APIKeyRepository({ db: inject.db });
  }

  async createAPIKey(data: CreateAPIKeyData) {
    const apiKey = APIKey.create(data);
    await this.apiKeyRepo.create(apiKey);

    return apiKey.props;
  }
}
