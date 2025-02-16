import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { groups, groupMembers } from "../apis/organizations";
import { Group } from "@/app/types/groups";
import {  setError, setGroups } from "../redux/slices/groupsSlice";
import {  setTeamMember } from "../redux/slices/teamSlice";
import {  setGroup } from "../redux/slices/groupDetailsSlice";
import { useDispatch } from "react-redux";
  
interface ErrorResponse {
    message: string;
}

export const useGroups = () => {
    const dispatch = useDispatch();

    const { data, isLoading, error } = useQuery({
        queryKey: ["groups"],
        queryFn: () => groups.getGroupsApi(),
        onSuccess: (data: any) => {
            dispatch(setGroups(data.groups));
        },
        onError: (error: Error) => {
            dispatch(setError(error.message));
        },
    })

    return {
      groups: data?.groups ?? [],
      isLoading,
      error,
    };
};

  export const useGroupsDetails = (groupId: string) => {
    const dispatch = useDispatch();

    const { data, isLoading, error } = useQuery({
        queryKey: ["groupDetails", groupId],
        queryFn: () => groups.getGroupDetailsApi(groupId),
        onSuccess: (data: any) => {
            dispatch(setGroup(data.group));
        },
        onError: (error: Error) => {
            dispatch(setError(error.message));
        },
    })

    return {
      group: data?.group ?? [],
      isLoading,
      error,
    };
};

export const useUpdateGroupDetails = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
      mutationFn: ({ groupId, data }: { groupId: string; data: Partial<Group> }) =>
        groups.updateGroupDetailsApi(groupId, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["groupDetails", variables.groupId])
        dispatch(setGroup(data.group))
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        dispatch(setError(error.response?.data?.message || "Failed to update group details"))
      },
    })
  }

export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (newGroup: Group) =>
            await groups.createGroupApi(newGroup),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            console.error("Failed to create group:", error.response?.data?.message);
        },
    });

    return {
        createGroup: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error,
    };
};

interface TeamMembersResponse {
  group_members: Array<{
    id: string;

  }>;
}

export const useTeamMembers = (groupId: string) => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery<TeamMembersResponse, AxiosError<ErrorResponse>>({
      queryKey: ["team", groupId],
      queryFn: () => groupMembers.getGroupMembersApi(groupId),
      onSuccess: (data: TeamMembersResponse) => {
          dispatch(setTeamMember(data));
      },
      onError: (error: AxiosError<ErrorResponse>) => {
          dispatch(setError(error.message));
      },
  });

  return {
    team: data?.group_members || [],
    isLoading,
    error,
  };
};