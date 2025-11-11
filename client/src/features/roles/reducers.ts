import type { CreateRole, UpdateRole, Role } from "./types";

export const EMPTY_ROLE: CreateRole = {
  name: "",
  description: "",
  isDefault: false,
};

type CreateRoleAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_IS_DEFAULT"; payload: boolean }
  | { type: "RESET" };

export function createRoleReducer(
  state: CreateRole,
  action: CreateRoleAction,
): CreateRole {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_IS_DEFAULT":
      return { ...state, isDefault: action.payload };
    case "RESET":
      return EMPTY_ROLE;
    default:
      return state;
  }
}

type EditRoleAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_IS_DEFAULT"; payload: boolean }
  | { type: "FILL_ROLE"; payload: Role }
  | { type: "RESET" };

export function editRoleReducer(
  state: UpdateRole,
  action: EditRoleAction,
): UpdateRole {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_IS_DEFAULT":
      return { ...state, isDefault: action.payload };
    case "FILL_ROLE":
      return action.payload;
    case "RESET":
      return EMPTY_ROLE;
    default:
      return state;
  }
}

// Dialog State Management
export type DialogState =
  | { type: "CLOSED" }
  | { type: "CREATE" }
  | { type: "EDIT"; role: Role }
  | { type: "DELETE"; role: Role };

export type DialogAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; role: Role }
  | { type: "OPEN_DELETE"; role: Role }
  | { type: "CLOSE" };

export const INITIAL_DIALOG_STATE: DialogState = { type: "CLOSED" };

export function dialogReducer(
  state: DialogState,
  action: DialogAction,
): DialogState {
  switch (action.type) {
    case "OPEN_CREATE":
      return { type: "CREATE" };
    case "OPEN_EDIT":
      return { type: "EDIT", role: action.role };
    case "OPEN_DELETE":
      return { type: "DELETE", role: action.role };
    case "CLOSE":
      return { type: "CLOSED" };
    default:
      return state;
  }
}
