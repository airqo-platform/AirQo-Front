import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Site } from "./sitesSlice";

  export interface Grid {
    _id: string;
    visibility: boolean;
    name: string;
    admin_level: string;
    network: string;
    long_name: string;
    createdAt: string;
    sites: Site[];
  }
  
  export interface City {
    _id: string;
    visibility: boolean;
    name: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    grids: Grid[];
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CitiesState {
    grids: Grid[];
    activeGrid: Grid[] | null;
    activeCohort: City[] | null;
    isLoading: boolean;
    error: string | null;
  }
  const initialState: CitiesState = {
    grids: [],
    activeGrid: null,
    activeCohort: null,
    isLoading: false,
    error: null,
  };

  const gridsSlice = createSlice({
    name: "grids",
    initialState,
    reducers: {
      setGrids(state, action: PayloadAction<Grid[]>) {
        state.grids = action.payload;
        state.isLoading = false;
        state.error = null;
      },
      set
      setActiveGrid(state, action: PayloadAction<Grid[]>) {
        state.activeGrid = action.payload;
      },
      setActiveCohort(state, action: PayloadAction<City[]>) {
        state.activeCohort = action.payload;
      },
      setLoading(state, action: PayloadAction<boolean>) {
        state.isLoading = action.payload;
      },
      setError(state, action: PayloadAction<string>) {
        state.error = action.payload;
        state.isLoading = false;
      },
    },
  });

export const { setGrids, setActiveCohort, setActiveGrid, setLoading, setError } = gridsSlice.actions;
export default gridsSlice.reducer;
