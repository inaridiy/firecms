// Simple enum to represent the permissions
export type APIKeyPermission =
  | "read"
  | "write"
  | "create"
  | "delete"
  | "update"
  | "all";

const authDataTables = ["user_credentials"];
const metaDataTables = ["user_profile", "content_types", "file_objects"];

const wildcardsToDenyTables = {
  "*": [] as string[],
  "metadata.*": authDataTables,
  "auth.*": metaDataTables,
  "common.*": [...authDataTables, ...metaDataTables],
};

export interface APIKeyProps {
  id: string;
  name: string;
  key: string;
  permissions: {
    [table: string]: string; // "read,write,create,delete,update" みたいな感じ 可読性重視
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class APIKey {
  get props() {
    return this._props;
  }

  constructor(private _props: APIKeyProps) {}

  static create(props: Omit<APIKeyProps, "id" | "key">) {
    return new APIKey({
      id: crypto.randomUUID(),
      key: crypto.randomUUID(),
      ...props,
    });
  }

  hasPermission(table: string, action: APIKeyPermission) {
    const permission = this._props.permissions[table];
    if (
      permission.split(",").includes(action) ||
      permission.split(",").includes("all")
    )
      return true;

    for (const _wildcard of Object.keys(wildcardsToDenyTables)) {
      const wildcard = _wildcard as keyof typeof wildcardsToDenyTables; // 頑張れTypescript
      const wildcardPermission = this._props.permissions[wildcard];
      const wildcardDenyTables = wildcardsToDenyTables[wildcard];
      if (!wildcardPermission) continue; // このワイルドカードは設定されていない
      if (wildcardDenyTables.includes(table)) continue; // このテーブルはこのワイルドカードで拒否されている
      if (
        wildcardPermission.split(",").includes(action) ||
        wildcardPermission.split(",").includes("all")
      )
        return true; // このワイルドカードで許可されている
    }
  }
}
