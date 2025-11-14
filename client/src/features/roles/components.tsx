import {
  Flex,
  TextField,
  Button,
  Table,
  AlertDialog,
  Text,
  Badge,
  Checkbox,
  TextArea,
} from "@radix-ui/themes";
import type { CreateRole, Role, UpdateRole } from "./types";
import { useEffect, useReducer } from "react";
import { ActionsMenu, SearchBar, TablePagination } from "../shared/components";
import {
  createRoleReducer,
  editRoleReducer,
  EMPTY_ROLE,
  dialogReducer,
  INITIAL_DIALOG_STATE,
} from "./reducers";
import { useAppSearchParams } from "../shared/hooks";
import { useMutateRoles, useRoles } from "./hooks";
import type { ActionsMenuItem } from "../shared/types";
import { Dialog } from "../shared/Dialog";
import { ICON_SIZE } from "../shared/constants";
import { useToast } from "../shared/Toast/hooks";
import { Spinner } from "../shared/Spinner";
import { CircleBackslashIcon } from "@radix-ui/react-icons";

// Roles Tab
export function RolesTab() {
  const [searchParams, setSearchParams] = useAppSearchParams();
  const [dialogState, dispatchDialog] = useReducer(
    dialogReducer,
    INITIAL_DIALOG_STATE,
  );
  const { showToast } = useToast();

  const { roles, isLoading, prevPage, nextPage } = useRoles();
  const { createRoleMutation, updateRoleMutation, deleteRoleMutation } =
    useMutateRoles();

  // Handlers
  const editRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      dispatchDialog({ type: "OPEN_EDIT", role });
    }
  };

  const updateRole = (roleId: string, payload: UpdateRole) => {
    updateRoleMutation.mutate(
      { roleId, data: payload },
      {
        onSuccess: () => {
          dispatchDialog({ type: "CLOSE" });
          showToast(
            "Role updated",
            `${payload.name} has been updated successfully`,
            "success",
          );
        },
        onError: (error) => {
          showToast("Failed to update role", error.message, "error");
        },
      },
    );
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      dispatchDialog({ type: "OPEN_DELETE", role });
    }
  };

  const confirmDeleteRole = () => {
    if (dialogState.type === "DELETE" && !dialogState.role.isDefault) {
      const roleName = dialogState.role.name;
      deleteRoleMutation.mutate(dialogState.role.id, {
        onSuccess: () => {
          dispatchDialog({ type: "CLOSE" });
          showToast(
            "Role deleted",
            `${roleName} has been deleted successfully`,
            "success",
          );
        },
      });
    }
  };

  const addRole = () => {
    dispatchDialog({ type: "OPEN_CREATE" });
  };

  const createRole = (payload: CreateRole) => {
    createRoleMutation.mutate(payload, {
      onSuccess: () => {
        dispatchDialog({ type: "CLOSE" });
        showToast(
          "Role created",
          `${payload.name} has been created successfully`,
          "success",
        );
      },
      onError: (error) => {
        showToast("Failed to create role", error.message, "error");
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

  return (
    <>
      <SearchBar
        value={searchParams.q}
        onChange={(value) => setSearchParams({ q: value })}
        onAdd={addRole}
        addLabel="Add role"
      />

      <Table.Root variant="surface" style={{ tableLayout: "fixed" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell width="75%">
              <Text color="gray">Name</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="17%">
              <Text color="gray">Created</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="8%" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Flex justify="center" align="center" py="6">
                  <Spinner message="Loading roles..." />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : roles.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
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
                    No roles found
                  </Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : (
            roles.map((role) => (
              <RoleTableRow
                key={role.id}
                role={role}
                onEdit={editRole}
                onDelete={deleteRole}
              />
            ))
          )}
          <TablePagination
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
            hasPrevious={!isLoading && prevPage !== null}
            hasNext={!isLoading && nextPage !== null}
            colSpan={3}
          />
        </Table.Body>
      </Table.Root>

      <DeleteRoleDialog
        role={dialogState.type === "DELETE" ? dialogState.role : null}
        onConfirm={confirmDeleteRole}
        onCancel={() => dispatchDialog({ type: "CLOSE" })}
        isDeleting={deleteRoleMutation.isPending}
      />

      <EditRoleDialog
        role={dialogState.type === "EDIT" ? dialogState.role : null}
        onSave={updateRole}
        onCancel={() => dispatchDialog({ type: "CLOSE" })}
        isSaving={updateRoleMutation.isPending}
      />

      <CreateRoleDialog
        isOpen={dialogState.type === "CREATE"}
        onSave={createRole}
        onCancel={() => dispatchDialog({ type: "CLOSE" })}
        isSaving={createRoleMutation.isPending}
      />
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
  const actions = [
    { label: "Edit Role", action: () => onEdit(roleId) },
    {
      label: "Delete Role",
      action: () => onDelete(roleId),
    },
  ] as ActionsMenuItem[];
  return <ActionsMenu title="Role actions menu" items={actions} />;
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
            {role.name}
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
      <Table.Cell>
        <Text size="2" color="gray">
          {createdDate}
        </Text>
      </Table.Cell>
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
  onSave: (roleId: string, payload: UpdateRole) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function EditRoleDialog({
  role,
  onSave,
  onCancel,
  isSaving,
}: EditRoleDialogProps) {
  const [updatedRole, dispatch] = useReducer(
    editRoleReducer,
    role ?? EMPTY_ROLE,
  );

  useEffect(() => {
    if (!role) return;
    dispatch({ type: "FILL_ROLE", payload: role });
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(role!.id, updatedRole);
  };

  if (!role) return null;

  return (
    <Dialog.Root open={!!role} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Edit role</Dialog.Title>
        <Dialog.Description size="2" mb="5" mt="-2" color="gray">
          Update the role's information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Dialog.FormField>
              {({ id }) => (
                <>
                  <Dialog.FormLabel>Name</Dialog.FormLabel>
                  <TextField.Root
                    value={updatedRole.name || ""}
                    onChange={(e) =>
                      dispatch({ type: "SET_NAME", payload: e.target.value })
                    }
                    placeholder="Enter role name"
                    required
                    disabled={isSaving}
                    id={id}
                  />
                </>
              )}
            </Dialog.FormField>
            <Dialog.FormField>
              {({ id }) => (
                <>
                  <Dialog.FormLabel>Description</Dialog.FormLabel>
                  <TextArea
                    value={updatedRole.description || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_DESCRIPTION",
                        payload: e.target.value,
                      })
                    }
                    placeholder="Enter role description (optional)"
                    disabled={isSaving}
                    id={id}
                  />
                </>
              )}
            </Dialog.FormField>
            <Dialog.FormField>
              {({ id }) => (
                <Flex gap="2" align="center">
                  <Checkbox
                    checked={updatedRole.isDefault || false}
                    onCheckedChange={(checked) =>
                      dispatch({
                        type: "SET_IS_DEFAULT",
                        payload: checked === true,
                      })
                    }
                    disabled={isSaving}
                    id={id}
                  />
                  <Text size="2" asChild>
                    <Dialog.FormLabel noStyles>
                      Set as default role
                    </Dialog.FormLabel>
                  </Text>
                </Flex>
              )}
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
                {isSaving ? "Updating..." : "Update role"}
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
  onSave: (payload: CreateRole) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function CreateRoleDialog({
  isOpen,
  onSave,
  onCancel,
  isSaving,
}: CreateRoleDialogProps) {
  const [newRole, dispatch] = useReducer(createRoleReducer, EMPTY_ROLE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newRole);
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
        <Dialog.Title>Add role</Dialog.Title>
        <Dialog.Description size="2" mb="5" mt="-2" color="gray">
          Create a new role by filling in the information below.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Dialog.FormField>
              {({ id }) => (
                <>
                  <Dialog.FormLabel>Name</Dialog.FormLabel>
                  <TextField.Root
                    id={id}
                    value={newRole.name}
                    onChange={(e) =>
                      dispatch({ type: "SET_NAME", payload: e.target.value })
                    }
                    placeholder="Enter role name"
                    required
                    disabled={isSaving}
                  />
                </>
              )}
            </Dialog.FormField>
            <Dialog.FormField>
              {({ id }) => (
                <>
                  <Dialog.FormLabel>Description</Dialog.FormLabel>
                  <TextArea
                    id={id}
                    value={newRole.description ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_DESCRIPTION",
                        payload: e.target.value,
                      })
                    }
                    placeholder="Enter role description (optional)"
                    disabled={isSaving}
                  />
                </>
              )}
            </Dialog.FormField>
            <Dialog.FormField>
              {({ id }) => (
                <>
                  <Flex gap="2" align="center">
                    <Checkbox
                      id={id}
                      checked={newRole.isDefault ?? false}
                      onCheckedChange={(checked) =>
                        dispatch({
                          type: "SET_IS_DEFAULT",
                          payload: checked === true,
                        })
                      }
                      disabled={isSaving}
                    />
                    <Text size="2" asChild>
                      <Dialog.FormLabel noStyles>
                        Set as default role
                      </Dialog.FormLabel>
                    </Text>
                  </Flex>
                </>
              )}
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
                {isSaving ? "Creating..." : "Create role"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
