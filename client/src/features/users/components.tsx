import {
  Flex,
  TextField,
  Button,
  Table,
  Avatar,
  AlertDialog,
  Text,
  Select,
} from "@radix-ui/themes";

import type { CreateUser, UpdateUser, User } from "./types";
import type { Role } from "../roles/types";
import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import { ActionsMenu, SearchBar, TablePagination } from "../shared/components";
import { useAppSearchParams } from "../shared/hooks";
import { useMutateUsers, useUsers } from "./hooks";
import { useRoles } from "../roles/hooks";
import type { ActionsMenuItem } from "../shared/types";
import {
  createUserReducer,
  editUserReducer,
  EMPTY_USER,
  dialogReducer,
  INITIAL_DIALOG_STATE,
} from "./reducers";
import { Dialog } from "../shared/Dialog";
import { ICON_SIZE, IDS } from "../shared/constants";
import { useToast } from "../shared/Toast/hooks";
import { Spinner } from "../shared/Spinner";
import { CircleBackslashIcon } from "@radix-ui/react-icons";

// Users Tab
export function UsersTab() {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const [dialogState, dispatchDialog] = useReducer(
    dialogReducer,
    INITIAL_DIALOG_STATE,
  );
  const { showToast } = useToast();

  const { users, isLoading: isLoadingUsers, prevPage, nextPage } = useUsers();
  const { createUserMutation, updateUserMutation, deleteUserMutation } =
    useMutateUsers();

  // Fetch all roles for user role selection (no search/pagination)
  const { roles, isLoading: isLoadingRoles } = useRoles();

  // Handlers
  const editUser = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        dispatchDialog({ type: "OPEN_EDIT", user });
      }
    },
    [users],
  );

  const updateUser = useCallback(
    (userId: string, payload: UpdateUser) => {
      updateUserMutation.mutate(
        { userId, data: payload },
        {
          onSuccess: () => {
            dispatchDialog({ type: "CLOSE" });
            showToast(
              "User updated",
              `${payload.first} ${payload.last} has been updated successfully`,
              "success",
            );
          },
          onError: (error) => {
            showToast("Failed to update user", error.message, "error");
          },
        },
      );
    },
    [updateUserMutation, showToast],
  );

  const deleteUser = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        dispatchDialog({ type: "OPEN_DELETE", user });
      }
    },
    [users],
  );

  const confirmDeleteUser = useCallback(() => {
    if (dialogState.type === "DELETE") {
      const userName = `${dialogState.user.first} ${dialogState.user.last}`;
      deleteUserMutation.mutate(dialogState.user.id, {
        onSuccess: () => {
          dispatchDialog({ type: "CLOSE" });
          showToast(
            "User deleted",
            `${userName} has been deleted successfully`,
            "success",
          );
        },
      });
    }
  }, [dialogState, deleteUserMutation, showToast]);

  const addUser = useCallback(() => {
    dispatchDialog({ type: "OPEN_CREATE" });
  }, []);

  const createUser = useCallback(
    (payload: CreateUser) => {
      createUserMutation.mutate(payload, {
        onSuccess: () => {
          dispatchDialog({ type: "CLOSE" });
          showToast(
            "User created",
            `${payload.first} ${payload.last} has been created successfully`,
            "success",
          );
        },
        onError: (error) => {
          showToast("Failed to create user", error.message, "error");
        },
      });
    },
    [createUserMutation, showToast],
  );

  const goToPreviousPage = useCallback(() => {
    if (prevPage !== null) {
      setSearchParams({ page: searchParams.page - 1 });
    }
  }, [prevPage, searchParams.page, setSearchParams]);

  const goToNextPage = useCallback(() => {
    if (nextPage !== null) {
      setSearchParams({ page: searchParams.page + 1 });
    }
  }, [nextPage, searchParams.page, setSearchParams]);

  // Create a map of roles for quick lookup
  const rolesMap = useMemo(() => {
    const map = new Map<string, Role>();
    roles.forEach((role) => map.set(role.id, role));
    return map;
  }, [roles]);

  const isLoading = isLoadingUsers ?? isLoadingRoles;

  return (
    <>
      <SearchBar
        value={searchParams.q}
        onChange={(value) => setSearchParams({ q: value })}
        onAdd={addUser}
        addLabel="Add user"
      />

      <Table.Root variant="surface" style={{ tableLayout: "fixed" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell width="40%">
              <Text color="gray">User</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="30%">
              <Text color="gray">Role</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="22%">
              <Text color="gray">Joined</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="8%" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Flex justify="center" align="center" py="6">
                  <Spinner message="Loading users..." />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : users.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Flex
                  justify="center"
                  align="center"
                  py="6"
                  direction="column"
                  gap="2"
                >
                  <CircleBackslashIcon
                    {...ICON_SIZE}
                    color="gray"
                    aria-hidden="true"
                  />
                  <Text color="gray" size="2">
                    No users found
                  </Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                role={rolesMap.get(user.roleId)}
                onEdit={editUser}
                onDelete={deleteUser}
              />
            ))
          )}
          <TablePagination
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
            hasPrevious={!isLoading && prevPage !== null}
            hasNext={!isLoading && nextPage !== null}
            colSpan={4}
          />
        </Table.Body>
      </Table.Root>

      <DeleteUserDialog
        user={dialogState.type === "DELETE" ? dialogState.user : null}
        onConfirm={confirmDeleteUser}
        onCancel={() => dispatchDialog({ type: "CLOSE" })}
        isDeleting={deleteUserMutation.isPending}
      />

      <EditUserDialog
        user={dialogState.type === "EDIT" ? dialogState.user : null}
        onSave={updateUser}
        onCancel={() => dispatchDialog({ type: "CLOSE" })}
        isSaving={updateUserMutation.isPending}
      />

      <CreateUserDialog
        isOpen={dialogState.type === "CREATE"}
        onSave={createUser}
        onCancel={() => dispatchDialog({ type: "CLOSE" })}
        isSaving={createUserMutation.isPending}
      />
    </>
  );
}

// User Actions Menu
interface UserActionsMenuProps {
  userId: string;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserActionsMenu({
  userId,
  onEdit,
  onDelete,
}: UserActionsMenuProps) {
  const actions = [
    { label: "Edit User", action: () => onEdit(userId) },
    {
      label: "Delete User",
      action: () => onDelete(userId),
    },
  ] as ActionsMenuItem[];
  return <ActionsMenu title="User actions menu" items={actions} />;
}

// User Table Row
interface UserTableRowProps {
  user: User;
  role: Role | undefined;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow = React.memo(function UserTableRow({
  user,
  role,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const fullName = `${user.first} ${user.last}`;
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Table.Row key={user.id}>
      <Table.Cell>
        <Flex gap="2" align="center">
          <Avatar
            size="1"
            src={user.photo}
            fallback={user.first.charAt(0)}
            radius="full"
            aria-label={`Avatar for ${fullName}`}
          />
          {fullName}
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Text color="gray">{role?.name ?? "Unknown"}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text color="gray">{joinedDate}</Text>
      </Table.Cell>
      <Table.Cell>
        <Flex justify="end">
          <UserActionsMenu
            userId={user.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
});

// Delete User Dialog
interface DeleteUserDialogProps {
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteUserDialog({
  user,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteUserDialogProps) {
  const fullName = user ? `${user.first} ${user.last}` : "";

  return (
    <AlertDialog.Root
      open={!!user}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialog.Content maxWidth="520px">
        <AlertDialog.Title>Delete user</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure? The user <strong>{fullName}</strong> will be permanently
          deleted.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="outline" color="gray" disabled={isDeleting}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="soft"
              color="red"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete user"}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

// Edit User Dialog
interface EditUserDialogProps {
  user: User | null;
  onSave: (userId: string, payload: UpdateUser) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function EditUserDialog({
  user,
  onSave,
  onCancel,
  isSaving,
}: EditUserDialogProps) {
  const [updatedUser, dispatch] = useReducer(editUserReducer, EMPTY_USER);
  const { roles } = useRoles();

  useEffect(() => {
    if (!user) return;
    dispatch({ type: "FILL_USER", payload: user });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user!.id, updatedUser);
  };

  if (!user) return null;

  return (
    <Dialog.Root open={!!user} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Edit user</Dialog.Title>
        <Dialog.Description size="2" mb="5" mt="-2" color="gray">
          Update the user's information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Dialog.FormField label="First Name" id={IDS.firstName}>
              <TextField.Root
                value={updatedUser.first}
                onChange={(e) =>
                  dispatch({ type: "SET_FIRST_NAME", payload: e.target.value })
                }
                placeholder="Enter first name"
                required
                disabled={isSaving}
                id={IDS.firstName}
              />
            </Dialog.FormField>
            <Dialog.FormField label="Last Name" id={IDS.lastName}>
              <TextField.Root
                value={updatedUser.last}
                onChange={(e) =>
                  dispatch({ type: "SET_LAST_NAME", payload: e.target.value })
                }
                placeholder="Enter last name"
                required
                disabled={isSaving}
                id={IDS.lastName}
              />
            </Dialog.FormField>
            <Dialog.FormField label="Role" id={IDS.roleId}>
              <Select.Root
                value={updatedUser.roleId}
                onValueChange={(value) =>
                  dispatch({ type: "SET_ROLE_ID", payload: value })
                }
                disabled={isSaving}
              >
                <Select.Trigger placeholder="Select a role" id={IDS.roleId} />
                <Select.Content>
                  {roles.map((role) => (
                    <Select.Item key={role.id} value={role.id}>
                      {role.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Dialog.FormField>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button
                  variant="outline"
                  color="gray"
                  type="button"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button variant="solid" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

// Create User Dialog
interface CreateUserDialogProps {
  isOpen: boolean;
  onSave: (payload: CreateUser) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function CreateUserDialog({
  isOpen,
  onSave,
  onCancel,
  isSaving,
}: CreateUserDialogProps) {
  const [newUser, dispatch] = useReducer(createUserReducer, EMPTY_USER);
  const { roles } = useRoles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newUser);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel();
      dispatch({ type: "RESET" });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Add user</Dialog.Title>
        <Dialog.Description size="2" mb="5" mt="-2" color="gray">
          Create a new user by filling in the information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Dialog.FormField label="First Name" id={IDS.firstName}>
              <TextField.Root
                value={newUser.first}
                onChange={(e) =>
                  dispatch({ type: "SET_FIRST_NAME", payload: e.target.value })
                }
                placeholder="Enter first name"
                required
                disabled={isSaving}
                id={IDS.firstName}
              />
            </Dialog.FormField>
            <Dialog.FormField label="Last Name" id={IDS.lastName}>
              <TextField.Root
                value={newUser.last}
                onChange={(e) =>
                  dispatch({ type: "SET_LAST_NAME", payload: e.target.value })
                }
                placeholder="Enter last name"
                required
                disabled={isSaving}
                id={IDS.lastName}
              />
            </Dialog.FormField>
            <Dialog.FormField label="Role" id={IDS.roleId}>
              <Select.Root
                value={newUser.roleId}
                onValueChange={(roleId) =>
                  dispatch({ type: "SET_ROLE_ID", payload: roleId })
                }
                disabled={isSaving}
              >
                <Select.Trigger placeholder="Select a role" id={IDS.roleId} />
                <Select.Content>
                  {roles.map((role) => (
                    <Select.Item key={role.id} value={role.id}>
                      {role.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Dialog.FormField>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button
                  variant="outline"
                  color="gray"
                  type="button"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button variant="solid" type="submit" disabled={isSaving}>
                {isSaving ? "Creating..." : "Create user"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
