import {
  Flex,
  TextField,
  Button,
  Table,
  Avatar,
  AlertDialog,
  Text,
  Select,
  Spinner,
} from "@radix-ui/themes";

import type { CreateUser, UpdateUser, User } from "./types";
import type { Role } from "../roles/types";
import { useEffect, useReducer } from "react";

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
import { IDS } from "../shared/constants";

// Users Tab
export function UsersTab() {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const [dialogState, dispatchDialog] = useReducer(
    dialogReducer,
    INITIAL_DIALOG_STATE,
  );

  const { users, isLoading: isLoadingUsers, prevPage, nextPage } = useUsers();
  const { createUserMutation, updateUserMutation, deleteUserMutation } =
    useMutateUsers();

  // Fetch all roles for user role selection (no search/pagination)
  const { roles, isLoading: isLoadingRoles } = useRoles();

  // Handlers
  const editUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      dispatchDialog({ type: "OPEN_EDIT", user });
    }
  };

  const updateUser = (userId: string, payload: UpdateUser) => {
    updateUserMutation.mutate(
      { userId, data: payload },
      {
        onSuccess: () => {
          dispatchDialog({ type: "CLOSE" });
        },
      },
    );
  };

  const deleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      dispatchDialog({ type: "OPEN_DELETE", user });
    }
  };

  const confirmDeleteUser = () => {
    if (dialogState.type === "DELETE") {
      deleteUserMutation.mutate(dialogState.user.id, {
        onSuccess: () => {
          dispatchDialog({ type: "CLOSE" });
        },
      });
    }
  };

  const addUser = () => {
    dispatchDialog({ type: "OPEN_CREATE" });
  };

  const createUser = (payload: CreateUser) => {
    createUserMutation.mutate(payload, {
      onSuccess: () => {
        dispatchDialog({ type: "CLOSE" });
      },
    });
  };

  const goToPreviousPage = () => {
    if (prevPage !== null) {
      setSearchParams({ page: searchParams.page - 1 });
    }
  };

  const goToNextPage = () => {
    if (nextPage !== null) {
      setSearchParams({ page: searchParams.page + 1 });
    }
  };

  // Create a map of roles for quick lookup
  const rolesMap = new Map<string, Role>();
  roles.forEach((role) => rolesMap.set(role.id, role));

  const isLoading = isLoadingUsers ?? isLoadingRoles;

  return (
    <>
      <SearchBar
        value={searchParams.q}
        onChange={(value) => setSearchParams({ q: value })}
        onAdd={addUser}
        addLabel="Add user"
      />

      {isLoading ? (
        <Flex justify="center" align="center" py="9">
          <Spinner size="3" />
        </Flex>
      ) : (
        <>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="36px" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Flex justify="center" align="center" py="6">
                      <Text color="gray" size="2">
                        No users found
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : (
                <>
                  {users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      role={rolesMap.get(user.roleId)}
                      onEdit={editUser}
                      onDelete={deleteUser}
                    />
                  ))}
                  <TablePagination
                    onPrevious={goToPreviousPage}
                    onNext={goToNextPage}
                    hasPrevious={prevPage !== null}
                    hasNext={nextPage !== null}
                    colSpan={4}
                  />
                </>
              )}
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
      )}
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

export function UserTableRow({
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
      <Table.Cell>{role?.name || "Unknown"}</Table.Cell>
      <Table.Cell>{joinedDate}</Table.Cell>
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
}

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
        <Dialog.Description size="2" mb="4">
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
        <Dialog.Description size="2" mb="4">
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
