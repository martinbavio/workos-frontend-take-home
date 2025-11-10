import { useState, useEffect } from "react";
import {
  Flex,
  TextField,
  Button,
  Table,
  Avatar,
  Tabs,
  IconButton,
  Box,
  AlertDialog,
  Dialog,
  Spinner,
  Text,
  Select,
} from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

// Constants
const ICON_SIZE = { width: "16", height: "16" } as const;
const MAX_CONTENT_WIDTH = "850px";
const DROPDOWN_SIDE_OFFSET = 5;

// Types
type TabValue = "users" | "roles";

interface User {
  id: string;
  name: string;
  role: string;
  joinedDate: string;
  avatarUrl?: string;
}

// Component: User Actions Menu
interface UserActionsMenuProps {
  userId: string;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

function UserActionsMenu({ userId, onEdit, onDelete }: UserActionsMenuProps) {
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

// Component: User Table Row
interface UserTableRowProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  return (
    <Table.Row key={user.id}>
      <Table.Cell>
        <Flex gap="2" align="center">
          <Avatar
            size="1"
            src={user.avatarUrl}
            fallback={user.name.charAt(0)}
            radius="full"
            aria-label={`Avatar for ${user.name}`}
          />
          {user.name}
        </Flex>
      </Table.Cell>
      <Table.Cell>{user.role}</Table.Cell>
      <Table.Cell>{user.joinedDate}</Table.Cell>
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

// Component: Delete User Dialog
interface DeleteUserDialogProps {
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteUserDialog({
  user,
  onConfirm,
  onCancel,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog.Root
      open={!!user}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialog.Content maxWidth="520px">
        <AlertDialog.Title>Delete user</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure? The user <strong>{user?.name}</strong> will be
          permanently deleted.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="outline" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="soft" color="red" onClick={onConfirm}>
              Delete user
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

// Component: Edit User Dialog
interface EditUserDialogProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

function EditUserDialog({ user, onSave, onCancel }: EditUserDialogProps) {
  const [formData, setFormData] = useState<User | null>(null);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData(null);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!user || !formData) return null;

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
                Name
              </Text>
              <TextField.Root
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Role
              </Text>
              <Select.Root
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <Select.Trigger placeholder="Select a role" />
                <Select.Content>
                  <Select.Item value="Design">Design</Select.Item>
                  <Select.Item value="Engineering">Engineering</Select.Item>
                  <Select.Item value="Developer Experience">
                    Developer Experience
                  </Select.Item>
                  <Select.Item value="Support">Support</Select.Item>
                  <Select.Item value="Product">Product</Select.Item>
                  <Select.Item value="Marketing">Marketing</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Joined Date
              </Text>
              <TextField.Root
                value={formData.joinedDate}
                onChange={(e) =>
                  setFormData({ ...formData, joinedDate: e.target.value })
                }
                placeholder="e.g., Jan 15, 2024"
                required
              />
            </label>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="outline" color="gray" type="button">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button variant="solid" type="submit">
                Save changes
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

// Component: Search Bar
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onAddUser: () => void;
}

function SearchBar({ value, onChange, onAddUser }: SearchBarProps) {
  return (
    <Flex gap="2" mb="5">
      <Box flexGrow="1">
        <TextField.Root
          placeholder="Search by name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flexGrow: 1 }}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon {...ICON_SIZE} aria-hidden="true" />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Button onClick={onAddUser}>
        <PlusIcon {...ICON_SIZE} aria-hidden="true" />
        Add user
      </Button>
    </Flex>
  );
}

// Component: Table Pagination
interface TablePaginationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function TablePagination({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: TablePaginationProps) {
  return (
    <Table.Row>
      <Table.Cell colSpan={4}>
        <Flex justify="end" gap="2">
          <Button
            variant="soft"
            disabled={!hasPrevious}
            onClick={onPrevious}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!hasNext}
            onClick={onNext}
            aria-label="Next page"
          >
            Next
          </Button>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Mark Tipton",
    role: "Design",
    joinedDate: "Aug 27, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=64",
  },
  {
    id: "2",
    name: "Lareina Cline",
    role: "Engineering",
    joinedDate: "Aug 22, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64",
  },
  {
    id: "3",
    name: "Terry Graf",
    role: "Engineering",
    joinedDate: "Jul 29, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64",
  },
  {
    id: "4",
    name: "Kristen Keller",
    role: "Engineering",
    joinedDate: "Jul 20, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64",
  },
  {
    id: "5",
    name: "Jennifer Todd",
    role: "Engineering",
    joinedDate: "Jul 16, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64",
  },
  {
    id: "6",
    name: "Sylvester Jenkins",
    role: "Developer Experience",
    joinedDate: "Jun 19, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64",
  },
  {
    id: "7",
    name: "Michelle Samuel",
    role: "Support",
    joinedDate: "May 23, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64",
  },
  {
    id: "8",
    name: "Stephanie Nelson",
    role: "Engineering",
    joinedDate: "Aug 13, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64",
  },
  {
    id: "9",
    name: "Andrew Pennington",
    role: "Developer Experience",
    joinedDate: "Apr 26, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64",
  },
  {
    id: "10",
    name: "Rebecca Morse",
    role: "Support",
    joinedDate: "Apr 5, 2024",
    avatarUrl:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64",
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("users");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isLoading] = useState(false); // TODO: Set to true when fetching data

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToEdit(user);
    }
  };

  const saveEditUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setUserToEdit(null);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToDelete(user);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id),
      );
      setUserToDelete(null);
    }
  };

  const handleAddUser = () => {
    console.log("Add user");
    // TODO: Implement add user functionality
  };

  const handlePreviousPage = () => {
    console.log("Previous page");
    // TODO: Implement pagination
  };

  const handleNextPage = () => {
    console.log("Next page");
    // TODO: Implement pagination
  };

  return (
    <Box maxWidth={MAX_CONTENT_WIDTH} mx="auto" p="5">
      <Tabs.Root
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
      >
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
        </Tabs.List>

        <Box mt="5">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onAddUser={handleAddUser}
          />

          {isLoading ? (
            <Flex justify="center" align="center" py="9">
              <Spinner size="3" />
            </Flex>
          ) : (
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
                {filteredUsers.length === 0 ? (
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
                    {filteredUsers.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                      />
                    ))}
                    <TablePagination
                      onPrevious={handlePreviousPage}
                      onNext={handleNextPage}
                      hasPrevious={false}
                      hasNext={true}
                    />
                  </>
                )}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
      </Tabs.Root>

      <DeleteUserDialog
        user={userToDelete}
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />

      <EditUserDialog
        user={userToEdit}
        onSave={saveEditUser}
        onCancel={() => setUserToEdit(null)}
      />
    </Box>
  );
}
