import { createSlice } from '@reduxjs/toolkit';
import { getAllEventsApi } from '../../apis';
import { isEmpty } from 'underscore';

export const getAllEvents = () => async (dispatch, getState) => {
  const lang = getState().eventsNavTab.languageTab;
  dispatch(isLoading(true));
  await getAllEventsApi(lang)
    .then((res) => {
      if (isEmpty(res || [])) return;
      dispatch(getEventsReducer(res));
    })
    .catch((err) => dispatch(getEventsFailure(err.message)));
  dispatch(isLoading(false));
};

export const eventSlice = createSlice({
  name: 'getEvents',
  initialState: {
    loading: false,
    events: [],
    errorMessage: ''
  },
  reducers: {
    getEventsReducer: (state, action) => {
      state.events = action.payload;
    },
    getEventsFailure: (state, action) => {
      state.errorMessage = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { getEventsReducer, getEventsFailure, isLoading } = eventSlice.actions;

export default eventSlice.reducer;
