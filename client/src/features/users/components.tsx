import {
  Flex,
  TextField,
  Button,
  Table,
  Avatar,
  IconButton,
  AlertDialog,
  Dialog,
  Text,
  Select,
  Spinner,
} from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { User } from "./types";
import type { Role } from "../roles/types";
import { useEffect, useState } from "react";
import { DROPDOWN_SIDE_OFFSET, ICON_SIZE } from "../shared/constants";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "./queries";
import { SearchBar, TablePagination } from "../shared/components";
import { useRoles } from "../roles/queries";
import { useAppSearchParams } from "../shared/hooks";

// Users Tab
export function UsersTab() {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  // Fetch users
  const { data: usersData, isLoading: isLoadingUsers } = useUsers(
    searchParams.page,
    searchParams.q || undefined,
  );

  // Fetch all roles for user role selection (no search/pagination)
  const { data: allRolesData, isLoading: isLoadingRoles } = useRoles();

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Handlers
  const editUser = (userId: string) => {
    const user = usersData?.data.find((u) => u.id === userId);
    if (user) {
      setUserToEdit(user);
    }
  };

  const updateUser = (
    userId: string,
    first: string,
    last: string,
    roleId: string,
  ) => {
    updateUserMutation.mutate(
      { userId, data: { first, last, roleId } },
      {
        onSuccess: () => {
          setUserToEdit(null);
        },
      },
    );
  };

  const deleteUser = (userId: string) => {
    const user = usersData?.data.find((u) => u.id === userId);
    if (user) {
      setUserToDelete(user);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setUserToDelete(null);
        },
      });
    }
  };

  const addUser = () => {
    setIsCreateUserDialogOpen(true);
  };

  const createUser = (first: string, last: string, roleId: string) => {
    createUserMutation.mutate(
      { first, last, roleId },
      {
        onSuccess: () => {
          setIsCreateUserDialogOpen(false);
        },
      },
    );
  };

  const goToPreviousPage = () => {
    if (usersData?.prev !== null) {
      setSearchParams({ page: searchParams.page - 1 });
    }
  };

  const goToNextPage = () => {
    if (usersData?.next !== null) {
      setSearchParams({ page: searchParams.page + 1 });
    }
  };

  // Reset page when search changes
  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [searchParams.q, setSearchParams]);

  const users = usersData?.data ?? [];
  const allRoles = allRolesData?.data ?? [];
  const isLoading = isLoadingUsers ?? isLoadingRoles;

  // Create a map of roles for quick lookup
  const rolesMap = new Map<string, Role>();
  if (allRolesData?.data) {
    allRolesData.data.forEach((role) => rolesMap.set(role.id, role));
  }

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
                    hasPrevious={usersData?.prev !== null}
                    hasNext={usersData?.next !== null}
                    colSpan={4}
                  />
                </>
              )}
            </Table.Body>
          </Table.Root>

          <DeleteUserDialog
            user={userToDelete}
            onConfirm={confirmDeleteUser}
            onCancel={() => setUserToDelete(null)}
            isDeleting={deleteUserMutation.isPending}
          />

          <EditUserDialog
            user={userToEdit}
            roles={allRoles}
            onSave={updateUser}
            onCancel={() => setUserToEdit(null)}
            isSaving={updateUserMutation.isPending}
          />

          <CreateUserDialog
            isOpen={isCreateUserDialogOpen}
            roles={allRoles}
            onSave={createUser}
            onCancel={() => setIsCreateUserDialogOpen(false)}
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
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="ghost" size="1" aria-label="User actions menu">
          <DotsHorizontalIcon {...ICON_SIZE} />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown-menu-content"
          side="bottom"
          align="end"
          sideOffset={DROPDOWN_SIDE_OFFSET}
        >
          <DropdownMenu.Item
            className="dropdown-menu-item"
            onSelect={() => onEdit(userId)}
          >
            Edit user
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-menu-item"
            onSelect={() => onDelete(userId)}
          >
            Delete user
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
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
  roles: Role[];
  onSave: (userId: string, first: string, last: string, roleId: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function EditUserDialog({
  user,
  roles,
  onSave,
  onCancel,
  isSaving,
}: EditUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first);
      setLastName(user.last);
      setRoleId(user.roleId);
    } else {
      setFirstName("");
      setLastName("");
      setRoleId("");
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave(user.id, firstName, lastName, roleId);
    }
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
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                First Name
              </Text>
              <TextField.Root
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Last Name
              </Text>
              <TextField.Root
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Role
              </Text>
              <Select.Root
                value={roleId}
                onValueChange={setRoleId}
                disabled={isSaving}
              >
                <Select.Trigger placeholder="Select a role" />
                <Select.Content>
                  {roles.map((role) => (
                    <Select.Item key={role.id} value={role.id}>
                      {role.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>

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
  roles: Role[];
  onSave: (first: string, last: string, roleId: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function CreateUserDialog({
  isOpen,
  roles,
  onSave,
  onCancel,
  isSaving,
}: CreateUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFirstName("");
      setLastName("");
      setRoleId("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(firstName, lastName, roleId);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Add user</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create a new user by filling in the information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                First Name
              </Text>
              <TextField.Root
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Last Name
              </Text>
              <TextField.Root
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Role
              </Text>
              <Select.Root
                value={roleId}
                onValueChange={setRoleId}
                disabled={isSaving}
              >
                <Select.Trigger placeholder="Select a role" />
                <Select.Content>
                  {roles.map((role) => (
                    <Select.Item key={role.id} value={role.id}>
                      {role.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>

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
