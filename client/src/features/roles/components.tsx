import {
  Flex,
  TextField,
  Button,
  Table,
  IconButton,
  AlertDialog,
  Dialog,
  Text,
  Badge,
  Checkbox,
  Spinner,
} from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Role } from "./types";
import { useEffect, useState } from "react";
import { DROPDOWN_SIDE_OFFSET, ICON_SIZE } from "../shared/constants";
import {
  useCreateRole,
  useDeleteRole,
  useRoles,
  useUpdateRole,
} from "./queries";
import { SearchBar, TablePagination } from "../shared/components";
import { useAppSearchParams } from "../shared/hooks";

// Roles Tab
export function RolesTab() {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false);

  console.log({ searchParams });
  // Fetch roles
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(
    searchParams.page,
    searchParams.q || undefined,
  );

  // Mutations
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  // Handlers
  const editRole = (roleId: string) => {
    const role = rolesData?.data.find((r) => r.id === roleId);
    if (role) {
      setRoleToEdit(role);
    }
  };

  const updateRole = (
    roleId: string,
    name: string,
    description: string,
    isDefault: boolean,
  ) => {
    const updates: {
      name?: string;
      description?: string;
      isDefault?: boolean;
    } = {};

    if (name !== roleToEdit?.name) updates.name = name;
    if (description !== roleToEdit?.description)
      updates.description = description;
    if (isDefault !== roleToEdit?.isDefault) updates.isDefault = isDefault;

    updateRoleMutation.mutate(
      { roleId, data: updates },
      {
        onSuccess: () => {
          setRoleToEdit(null);
        },
      },
    );
  };

  const deleteRole = (roleId: string) => {
    const role = rolesData?.data.find((r) => r.id === roleId);
    if (role) {
      setRoleToDelete(role);
    }
  };

  const confirmDeleteRole = () => {
    if (roleToDelete && !roleToDelete.isDefault) {
      deleteRoleMutation.mutate(roleToDelete.id, {
        onSuccess: () => {
          setRoleToDelete(null);
        },
      });
    }
  };

  const addRole = () => {
    setIsCreateRoleDialogOpen(true);
  };

  const createRole = (
    name: string,
    description: string,
    isDefault: boolean,
  ) => {
    createRoleMutation.mutate(
      { name, description: description || undefined, isDefault },
      {
        onSuccess: () => {
          setIsCreateRoleDialogOpen(false);
        },
      },
    );
  };

  const goToPreviousPage = () => {
    if (rolesData?.prev !== null) {
      setSearchParams({ page: searchParams.page - 1 });
    }
  };

  const goToNextPage = () => {
    if (rolesData?.next !== null) {
      setSearchParams({ page: searchParams.page + 1 });
    }
  };

  // Reset page when search changes
  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [searchParams.q, setSearchParams]);

  const roles = rolesData?.data || [];

  return (
    <>
      <SearchBar
        value={searchParams.q}
        onChange={(value) => setSearchParams({ q: value })}
        onAdd={addRole}
        addLabel="Add role"
      />

      {isLoadingRoles ? (
        <Flex justify="center" align="center" py="9">
          <Spinner size="3" />
        </Flex>
      ) : (
        <>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="36px" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {roles.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Flex justify="center" align="center" py="6">
                      <Text color="gray" size="2">
                        No roles found
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : (
                <>
                  {roles.map((role) => (
                    <RoleTableRow
                      key={role.id}
                      role={role}
                      onEdit={editRole}
                      onDelete={deleteRole}
                    />
                  ))}
                  <TablePagination
                    onPrevious={goToPreviousPage}
                    onNext={goToNextPage}
                    hasPrevious={rolesData?.prev !== null}
                    hasNext={rolesData?.next !== null}
                    colSpan={3}
                  />
                </>
              )}
            </Table.Body>
          </Table.Root>

          <DeleteRoleDialog
            role={roleToDelete}
            onConfirm={confirmDeleteRole}
            onCancel={() => setRoleToDelete(null)}
            isDeleting={deleteRoleMutation.isPending}
          />

          <EditRoleDialog
            role={roleToEdit}
            onSave={updateRole}
            onCancel={() => setRoleToEdit(null)}
            isSaving={updateRoleMutation.isPending}
          />

          <CreateRoleDialog
            isOpen={isCreateRoleDialogOpen}
            onSave={createRole}
            onCancel={() => setIsCreateRoleDialogOpen(false)}
            isSaving={createRoleMutation.isPending}
          />
        </>
      )}
    </>
  );
}

// Role Actions Menu
interface RoleActionsMenuProps {
  roleId: string;
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
}

export function RoleActionsMenu({
  roleId,
  onEdit,
  onDelete,
}: RoleActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="ghost" size="1" aria-label="Role actions menu">
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
            onSelect={() => onEdit(roleId)}
          >
            Edit role
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-menu-item"
            onSelect={() => onDelete(roleId)}
          >
            Delete role
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Role Table Row
interface RoleTableRowProps {
  role: Role;
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
}

export function RoleTableRow({ role, onEdit, onDelete }: RoleTableRowProps) {
  const createdDate = new Date(role.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Table.Row key={role.id}>
      <Table.Cell>
        <Flex direction="column" gap="1">
          <Flex gap="2" align="center">
            <Text weight="medium">{role.name}</Text>
            {role.isDefault && (
              <Badge size="1" color="blue">
                Default
              </Badge>
            )}
          </Flex>
          {role.description && (
            <Text size="1" color="gray">
              {role.description}
            </Text>
          )}
        </Flex>
      </Table.Cell>
      <Table.Cell>{createdDate}</Table.Cell>
      <Table.Cell>
        <Flex justify="end">
          <RoleActionsMenu
            roleId={role.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
}

// Delete Role Dialog
interface DeleteRoleDialogProps {
  role: Role | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteRoleDialog({
  role,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteRoleDialogProps) {
  return (
    <AlertDialog.Root
      open={!!role}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialog.Content maxWidth="520px">
        <AlertDialog.Title>Delete role</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure? The role <strong>{role?.name}</strong> will be
          permanently deleted.
          {role?.isDefault && (
            <>
              <br />
              <br />
              <Text color="red" weight="bold">
                Note: You cannot delete the default role.
              </Text>
            </>
          )}
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
              disabled={isDeleting || role?.isDefault}
            >
              {isDeleting ? "Deleting..." : "Delete role"}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

// Edit Role Dialog
interface EditRoleDialogProps {
  role: Role | null;
  onSave: (
    roleId: string,
    name: string,
    description: string,
    isDefault: boolean,
  ) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function EditRoleDialog({
  role,
  onSave,
  onCancel,
  isSaving,
}: EditRoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || "");
      setIsDefault(role.isDefault);
    } else {
      setName("");
      setDescription("");
      setIsDefault(false);
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      onSave(role.id, name, description, isDefault);
    }
  };

  if (!role) return null;

  return (
    <Dialog.Root open={!!role} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Edit role</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Update the role's information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description (optional)"
                disabled={isSaving}
              />
            </label>

            <label>
              <Flex gap="2" align="center">
                <Checkbox
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked === true)}
                  disabled={isSaving}
                />
                <Text size="2">Set as default role</Text>
              </Flex>
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

// Create Role Dialog
interface CreateRoleDialogProps {
  isOpen: boolean;
  onSave: (name: string, description: string, isDefault: boolean) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function CreateRoleDialog({
  isOpen,
  onSave,
  onCancel,
  isSaving,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setIsDefault(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, description, isDefault);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Add role</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create a new role by filling in the information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description (optional)"
                disabled={isSaving}
              />
            </label>

            <label>
              <Flex gap="2" align="center">
                <Checkbox
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked === true)}
                  disabled={isSaving}
                />
                <Text size="2">Set as default role</Text>
              </Flex>
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
                {isSaving ? "Creating..." : "Create role"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
