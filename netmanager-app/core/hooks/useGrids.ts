import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { grids } from "../apis/grids";
import { CreateGrid } from "@/app/types/grids";
import { GridsState, setError, setGrids } from "../redux/slices/gridsSlice";
import { useDispatch } from "react-redux";

interface ErrorResponse {
  message: string;
}

// Hook to get the grid summary
export const useGridSummary = (networkId: string) => {
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: async () => await grids.getGridsApi(networkId),
    onSuccess: (data: GridsState) => {
      dispatch(setGrids(data.grids));
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      dispatch(setError(error.message));
    },
  });

  return {
    grids: mutation.mutate || [],
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  };
};

// Hook to get grid details by gridId
export const useGridDetails = (gridId: string) => {
  const mutation = useMutation({
    mutationFn: async () => await grids.getGridDetailsApi(gridId),
    onSuccess: () => {
      console.log("Grid details fetched successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Failed to fetch grid details:",
        error.response?.data?.message
      );
    },
  });

  return {
    getGridDetails: mutation.mutate || [],
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  };
};

// Hook to update grid details
export const useUpdateGridDetails = (gridId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await grids.updateGridDetailsApi(gridId),
    onSuccess: () => {
      // Invalidate and refetch the grid details
      queryClient.invalidateQueries({ queryKey: ["gridDetails", gridId] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        "Failed to update grid details:",
        error.response?.data?.message
      );
    },
  });

  return {
    updateGridDetails: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

// Hook to create a new grid
export const useCreateGrid = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newGrid: CreateGrid) =>
      await grids.createGridApi(newGrid),
    onSuccess: () => {
      // Invalidate and refetch the grid summary after creating a new grid
      queryClient.invalidateQueries({ queryKey: ["gridSummary"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Failed to create grid:", error.response?.data?.message);
    },
  });

  return {
    createGrid: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
