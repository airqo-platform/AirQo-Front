import { createSlice } from '@reduxjs/toolkit';
import { collocateDevices } from '.';

const collocationDataSlice = createSlice({
  name: 'collocationData',
  initialState: {
    collocationData: null,
    isLoading: false,
    errorValue: null,
  },
  reducers: {
    addCollocationData(state, action) {
      state.collocationData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(collocateDevices.matchPending, (state, action) => {
        state.isLoading = true;
        state.errorValue = null;
      })
      .addMatcher(collocateDevices.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.errorValue = null;
        const collocationData = action.payload;
        // Dispatch the 'addCollocationData' action to update the state with the new post data
        collocationDataSlice.actions.addCollocationData(collocationData);
      })
      .addMatcher(collocateDevices.matchRejected, (state, action) => {
        state.isLoading = false;
        state.errorValue = action.error.message;
      });
  },
});

export const { addCollocationData } = collocationDataSlice.actions;

export default collocationDataSlice.reducer;
