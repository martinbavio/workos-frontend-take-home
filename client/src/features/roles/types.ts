export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  isDefault: boolean;
}

export interface CreateRole {
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface UpdateRole {
  name?: string;
  description?: string;
  isDefault?: boolean;
}
