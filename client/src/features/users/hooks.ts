import { useAppSearchParams } from "../shared/hooks";
import {
  useCreateUser,
  useDeleteUser,
  useGetUsers,
  useUpdateUser,
} from "./queries";

export function useUsers() {
  const [searchParams] = useAppSearchParams();
  const { data: users, isLoading } = useGetUsers(
    searchParams.page,
    searchParams.q ?? undefined,
  );

  return {
    users: users?.data ?? [],
    isLoading,
    prevPage: users?.prev,
    nextPage: users?.next,
  };
}

export function useMutateUsers() {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
}
