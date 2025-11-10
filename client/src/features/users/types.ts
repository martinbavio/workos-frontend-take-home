export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  first: string;
  last: string;
  roleId: string;
  photo?: string;
}

export interface CreateUser {
  first: string;
  last: string;
  roleId: string;
}

export interface UpdateUser {
  first?: string;
  last?: string;
  roleId?: string;
}
