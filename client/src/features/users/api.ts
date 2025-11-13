import { API_BASE_URL } from "../shared/constants";
import { handleFetch } from "../shared/api-utils";
import type { PagedData } from "../shared/types";
import type { CreateUser, UpdateUser, User } from "./types";

export async function getUsers(
  page: number = 1,
  search?: string,
): Promise<PagedData<User>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (search) {
    params.append("search", search);
  }

  return handleFetch<PagedData<User>>(
    `${API_BASE_URL}/users?${params.toString()}`,
  );
}

export async function getUser(userId: string): Promise<User> {
  return handleFetch<User>(`${API_BASE_URL}/users/${userId}`);
}

export async function createUser(data: CreateUser): Promise<User> {
  return handleFetch<User>(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  userId: string,
  data: UpdateUser,
): Promise<User> {
  return handleFetch<User>(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: string): Promise<User> {
  return handleFetch<User>(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
}
