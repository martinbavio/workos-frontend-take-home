import { describe, it, expect } from "vitest";
import {
  createUserReducer,
  dialogReducer,
  editUserReducer,
  EMPTY_USER,
  INITIAL_DIALOG_STATE,
} from "./reducers";
import type { User } from "./types";

const testUser: User = {
  id: "1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  first: "John",
  last: "Doe",
  roleId: "role-1",
  photo: "https://example.com/photo.jpg",
};

describe("dialogReducer", () => {
  it("should open create dialog", () => {
    const nextState = dialogReducer(INITIAL_DIALOG_STATE, {
      type: "OPEN_CREATE",
    });

    expect(nextState).toEqual({ type: "CREATE" });
  });

  it("should open edit dialog with user", () => {
    const nextState = dialogReducer(INITIAL_DIALOG_STATE, {
      type: "OPEN_EDIT",
      user: testUser,
    });

    expect(nextState).toEqual({ type: "EDIT", user: testUser });
  });

  it("should open delete dialog with user", () => {
    const nextState = dialogReducer(INITIAL_DIALOG_STATE, {
      type: "OPEN_DELETE",
      user: testUser,
    });

    expect(nextState).toEqual({ type: "DELETE", user: testUser });
  });

  it("should close dialog", () => {
    const openState = { type: "EDIT" as const, user: testUser };
    const nextState = dialogReducer(openState, {
      type: "CLOSE",
    });

    expect(nextState).toEqual({ type: "CLOSED" });
  });
});

describe("createUserReducer", () => {
  it("should update first name", () => {
    const nextState = createUserReducer(EMPTY_USER, {
      type: "SET_FIRST_NAME",
      payload: "Jane",
    });

    expect(nextState).toEqual({
      ...EMPTY_USER,
      first: "Jane",
    });
  });

  it("should update last name", () => {
    const nextState = createUserReducer(EMPTY_USER, {
      type: "SET_LAST_NAME",
      payload: "Smith",
    });

    expect(nextState).toEqual({
      ...EMPTY_USER,
      last: "Smith",
    });
  });

  it("should update role ID", () => {
    const nextState = createUserReducer(EMPTY_USER, {
      type: "SET_ROLE_ID",
      payload: "role-2",
    });

    expect(nextState).toEqual({
      ...EMPTY_USER,
      roleId: "role-2",
    });
  });

  it("should reset to empty user", () => {
    const modifiedUser = {
      first: "Jane",
      last: "Smith",
      roleId: "role-2",
    };

    const nextState = createUserReducer(modifiedUser, {
      type: "RESET",
    });

    expect(nextState).toEqual(EMPTY_USER);
  });

  it("should handle multiple updates", () => {
    let nextState = createUserReducer(EMPTY_USER, {
      type: "SET_FIRST_NAME",
      payload: "Alice",
    });

    nextState = createUserReducer(nextState, {
      type: "SET_LAST_NAME",
      payload: "Johnson",
    });

    nextState = createUserReducer(nextState, {
      type: "SET_ROLE_ID",
      payload: "role-3",
    });

    expect(nextState).toEqual({
      first: "Alice",
      last: "Johnson",
      roleId: "role-3",
    });
  });
});

describe("editUserReducer", () => {
  it("should fill user", () => {
    const nextState = editUserReducer(EMPTY_USER, {
      type: "FILL_USER",
      payload: testUser,
    });

    expect(nextState).toEqual(testUser);
  });

  it("should update first name", () => {
    const nextState = editUserReducer(testUser, {
      type: "SET_FIRST_NAME",
      payload: "Jane",
    });

    expect(nextState).toEqual({
      ...testUser,
      first: "Jane",
    });
  });

  it("should update last name", () => {
    const nextState = editUserReducer(testUser, {
      type: "SET_LAST_NAME",
      payload: "Smith",
    });

    expect(nextState).toEqual({
      ...testUser,
      last: "Smith",
    });
  });

  it("should update role ID", () => {
    const nextState = editUserReducer(testUser, {
      type: "SET_ROLE_ID",
      payload: "role-2",
    });

    expect(nextState).toEqual({
      ...testUser,
      roleId: "role-2",
    });
  });

  it("should reset to empty user", () => {
    const nextState = editUserReducer(testUser, {
      type: "RESET",
    });

    expect(nextState).toEqual(EMPTY_USER);
  });

  it("should handle partial updates", () => {
    const nextState = editUserReducer(testUser, {
      type: "SET_FIRST_NAME",
      payload: "Alice",
    });

    expect(nextState.first).toBe("Alice");
    expect(nextState.last).toBe("Doe"); // unchanged
    expect(nextState.roleId).toBe("role-1"); // unchanged
  });
});
