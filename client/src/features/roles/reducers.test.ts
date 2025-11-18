import { describe, it, expect } from "vitest";
import {
  createRoleReducer,
  dialogReducer,
  editRoleReducer,
  EMPTY_ROLE,
  INITIAL_DIALOG_STATE,
} from "./reducers";
import type { Role } from "./types";

const testRole: Role = {
  id: "1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  name: "Test",
  isDefault: false,
};

describe("dialogReducer", () => {
  it("should open create dialog", () => {
    const nextState = dialogReducer(INITIAL_DIALOG_STATE, {
      type: "OPEN_CREATE",
    });

    expect(nextState).toEqual({ type: "CREATE" });
  });

  it("should open edit dialog with role", () => {
    const nextState = dialogReducer(INITIAL_DIALOG_STATE, {
      type: "OPEN_EDIT",
      role: testRole,
    });

    expect(nextState).toEqual({ type: "EDIT", role: testRole });
  });

  it("should open delete dialog with role", () => {
    const nextState = dialogReducer(INITIAL_DIALOG_STATE, {
      type: "OPEN_DELETE",
      role: testRole,
    });

    expect(nextState).toEqual({ type: "DELETE", role: testRole });
  });

  it("should close dialog", () => {
    const openState = { type: "EDIT" as const, role: testRole };
    const nextState = dialogReducer(openState, {
      type: "CLOSE",
    });

    expect(nextState).toEqual({ type: "CLOSED" });
  });
});

describe("createRoleReducer", () => {
  it("should update name", () => {
    const nextState = createRoleReducer(EMPTY_ROLE, {
      type: "SET_NAME",
      payload: "Designer",
    });

    expect(nextState).toEqual({
      ...EMPTY_ROLE,
      name: "Designer",
    });
  });

  it("should update description", () => {
    const nextState = createRoleReducer(EMPTY_ROLE, {
      type: "SET_DESCRIPTION",
      payload: "Design team member",
    });

    expect(nextState).toEqual({
      ...EMPTY_ROLE,
      description: "Design team member",
    });
  });

  it("should update isDefault", () => {
    const nextState = createRoleReducer(EMPTY_ROLE, {
      type: "SET_IS_DEFAULT",
      payload: true,
    });

    expect(nextState).toEqual({
      ...EMPTY_ROLE,
      isDefault: true,
    });
  });

  it("should reset to empty role", () => {
    const modifiedRole = {
      name: "Designer",
      description: "Design team member",
      isDefault: true,
    };

    const nextState = createRoleReducer(modifiedRole, {
      type: "RESET",
    });

    expect(nextState).toEqual(EMPTY_ROLE);
  });

  it("should handle multiple updates", () => {
    let nextState = createRoleReducer(EMPTY_ROLE, {
      type: "SET_NAME",
      payload: "Admin",
    });

    nextState = createRoleReducer(nextState, {
      type: "SET_DESCRIPTION",
      payload: "Administrator role",
    });

    nextState = createRoleReducer(nextState, {
      type: "SET_IS_DEFAULT",
      payload: true,
    });

    expect(nextState).toEqual({
      name: "Admin",
      description: "Administrator role",
      isDefault: true,
    });
  });
});

describe("editRoleReducer", () => {
  it("should fill role", () => {
    const nextState = editRoleReducer(EMPTY_ROLE, {
      type: "FILL_ROLE",
      payload: testRole,
    });

    expect(nextState).toEqual(testRole);
  });

  it("should update name", () => {
    const nextState = editRoleReducer(testRole, {
      type: "SET_NAME",
      payload: "Super Admin",
    });

    expect(nextState).toEqual({
      ...testRole,
      name: "Super Admin",
    });
  });

  it("should update description", () => {
    const nextState = editRoleReducer(testRole, {
      type: "SET_DESCRIPTION",
      payload: "Updated description",
    });

    expect(nextState).toEqual({
      ...testRole,
      description: "Updated description",
    });
  });

  it("should update isDefault", () => {
    const nextState = editRoleReducer(testRole, {
      type: "SET_IS_DEFAULT",
      payload: true,
    });

    expect(nextState).toEqual({
      ...testRole,
      isDefault: true,
    });
  });

  it("should reset to empty role", () => {
    const nextState = editRoleReducer(testRole, {
      type: "RESET",
    });

    expect(nextState).toEqual(EMPTY_ROLE);
  });

  it("should handle partial updates", () => {
    const nextState = editRoleReducer(EMPTY_ROLE, {
      type: "SET_NAME",
      payload: "Modified Role",
    });

    expect(nextState.name).toBe("Modified Role");
    expect(nextState.isDefault).toBe(false); // unchanged
  });
});
