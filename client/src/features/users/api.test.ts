import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser, getUsers } from "./api";
import type { User } from "./types";
import { API_BASE_URL } from "../shared/constants";

const mockFetch = vi.fn();
const mockUsers: User[] = [
  {
    id: "1",
    first: "John",
    last: "Doe",
    roleId: "role-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    first: "Jane",
    last: "Doe",
    roleId: "role-2",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    first: "Jason",
    last: "Bourne",
    roleId: "role-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

describe("getUsers", () => {
  beforeEach(() => {
    globalThis.fetch = mockFetch;
    vi.resetAllMocks();
  });

  it("should get some users", async () => {
    const mockPagedData = {
      data: mockUsers,
      next: 2,
      prev: null,
      pages: 3,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPagedData),
    } as Response);

    const result = await getUsers();

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/users?page=1`);
    expect(result).toEqual(mockPagedData);
  });

  it("should get users with search parameter", async () => {
    const mockPagedData = {
      data: [mockUsers[0]],
      next: null,
      prev: null,
      pages: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPagedData),
    } as Response);

    const result = await getUsers(1, "John");

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/users?page=1&search=John`,
    );
    expect(result).toEqual(mockPagedData);
  });

  it("should throw error when request fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(getUsers()).rejects.toThrow("Failed to fetch users");
  });
});

describe("createUser", () => {
  beforeEach(() => {
    globalThis.fetch = mockFetch;
    vi.resetAllMocks();
  });

  it("should create user and return data", async () => {
    const mockUser = { first: "John", last: "Doe", roleId: "1" };
    const mockResponse = { id: "123", ...mockUser };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await createUser(mockUser);

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockUser),
    });
    expect(result).toEqual(mockResponse);
  });

  it("should throw error when request fails", async () => {
    const mockUser = { first: "John", last: "Doe", roleId: "1" };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Missing required field: first" }),
    } as Response);

    await expect(createUser(mockUser)).rejects.toThrow(
      "Missing required field: first",
    );
  });
});
