export interface FileObjectProps {
  id: string;
  name?: string;
  contentType: string;
  size: number;
  metadata: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FileObject {
  get props() {
    return this._props;
  }

  constructor(private _props: FileObjectProps) {}

  static create(props: Omit<FileObjectProps, "id">) {
    return new FileObject({ id: crypto.randomUUID(), ...props });
  }
}
