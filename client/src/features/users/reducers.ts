import type { CreateUser, UpdateUser, User } from "./types";

export const EMPTY_USER: CreateUser = {
  first: "",
  last: "",
  roleId: "",
};

type CreateUserAction =
  | { type: "SET_FIRST_NAME"; payload: string }
  | { type: "SET_LAST_NAME"; payload: string }
  | { type: "SET_ROLE_ID"; payload: string }
  | { type: "RESET" };

export function createUserReducer(
  state: CreateUser,
  action: CreateUserAction,
): CreateUser {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return { ...state, first: action.payload };
    case "SET_LAST_NAME":
      return { ...state, last: action.payload };
    case "SET_ROLE_ID":
      return { ...state, roleId: action.payload };
    case "RESET":
      return EMPTY_USER;
    default:
      return state;
  }
}

type EditUserAction =
  | { type: "SET_FIRST_NAME"; payload: string }
  | { type: "SET_LAST_NAME"; payload: string }
  | { type: "SET_ROLE_ID"; payload: string }
  | { type: "FILL_USER"; payload: User }
  | { type: "RESET" };

export function editUserReducer(
  state: UpdateUser,
  action: EditUserAction,
): UpdateUser {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return { ...state, first: action.payload };
    case "SET_LAST_NAME":
      return { ...state, last: action.payload };
    case "SET_ROLE_ID":
      return { ...state, roleId: action.payload };
    case "FILL_USER":
      return action.payload;
    case "RESET":
      return EMPTY_USER;
    default:
      return state;
  }
}

// Dialog State Management with Discriminated Union
export type DialogState =
  | { type: "CLOSED" }
  | { type: "CREATE" }
  | { type: "EDIT"; user: User }
  | { type: "DELETE"; user: User };

export type DialogAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; user: User }
  | { type: "OPEN_DELETE"; user: User }
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
      return { type: "EDIT", user: action.user };
    case "OPEN_DELETE":
      return { type: "DELETE", user: action.user };
    case "CLOSE":
      return { type: "CLOSED" };
    default:
      return state;
  }
}
