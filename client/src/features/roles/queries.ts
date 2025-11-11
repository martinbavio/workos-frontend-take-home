import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole, deleteRole, getRole, getRoles, updateRole } from "./api";
import type { CreateRole, UpdateRole } from "./types";

// Query key factory
export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (page: number, search?: string) =>
    [...roleKeys.lists(), { page, search }] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

// Fetch paginated roles
export function useGetRoles(page: number = 1, search?: string) {
  return useQuery({
    queryKey: roleKeys.list(page, search),
    queryFn: () => getRoles(page, search),
  });
}

// Fetch single role
export function useGetRole(roleId: string) {
  return useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: () => getRole(roleId),
    enabled: !!roleId,
  });
}

// Create role mutation
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRole) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// Update role mutation
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRole }) =>
      updateRole(roleId, data),
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(updatedRole.id),
      });
    },
  });
}

// Delete role mutation
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}
