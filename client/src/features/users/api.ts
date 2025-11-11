import { API_BASE_URL } from "../shared/constants";
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

  const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function getUser(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

export async function createUser(data: CreateUser): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to create user");
  }
  return response.json();
}

export async function updateUser(
  userId: string,
  data: UpdateUser,
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Failed to update user");
  }
  return response.json();
}

export async function deleteUser(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }

    const error = await response.json();
    throw new Error(error.message ?? "Failed to delete user");
  }
  return response.json();
}
