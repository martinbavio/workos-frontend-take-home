import { useAppSearchParams } from "../shared/hooks";
import {
  useCreateRole,
  useDeleteRole,
  useGetRoles,
  useUpdateRole,
} from "./queries";

export function useRoles() {
  const [searchParams] = useAppSearchParams();
  const { data: roles, isLoading } = useGetRoles(
    searchParams.page,
    searchParams.q ?? undefined,
  );

  return {
    roles: roles?.data ?? [],
    isLoading,
    prevPage: roles?.prev,
    nextPage: roles?.next,
  };
}

export function useMutateRoles() {
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  return {
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
  };
}
