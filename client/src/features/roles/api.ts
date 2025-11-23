import { API_BASE_URL } from "../shared/constants";
import { handleFetch } from "../shared/api-utils";
import type { PagedData } from "../shared/types";
import type { CreateRole, Role, UpdateRole } from "./types";

export async function getRoles(
  page: number = 1,
  search?: string,
): Promise<PagedData<Role>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (search) {
    params.append("search", search);
  }

  return handleFetch<PagedData<Role>>(
    `${API_BASE_URL}/roles?${params.toString()}`,
  );
}

export async function getRole(roleId: string): Promise<Role> {
  return handleFetch<Role>(`${API_BASE_URL}/roles/${roleId}`);
}

export async function createRole(data: CreateRole): Promise<Role> {
  return handleFetch<Role>(`${API_BASE_URL}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateRole(
  roleId: string,
  data: UpdateRole,
): Promise<Role> {
  return handleFetch<Role>(`${API_BASE_URL}/roles/${roleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteRole(roleId: string): Promise<Role> {
  return handleFetch<Role>(`${API_BASE_URL}/roles/${roleId}`, {
    method: "DELETE",
  });
}
