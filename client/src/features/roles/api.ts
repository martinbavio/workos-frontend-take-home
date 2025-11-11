import { API_BASE_URL } from "../shared/constants";
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

  const response = await fetch(`${API_BASE_URL}/roles?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }
  return response.json();
}

export async function getRole(roleId: string): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Role not found");
    }
    throw new Error("Failed to fetch role");
  }
  return response.json();
}

export async function createRole(data: CreateRole): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to create role");
  }
  return response.json();
}

export async function updateRole(
  roleId: string,
  data: UpdateRole,
): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to update role");
  }
  return response.json();
}

export async function deleteRole(roleId: string): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to delete role");
  }
  return response.json();
}
