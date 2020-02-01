import { createSlice } from '@reduxjs/toolkit';
import { getRequestLogs } from '../api'

const initialRequestLogsState = {
  logsByEndPoint : {},
  metaByEndPoint: {},
  isLoading: false,
  error: null
}

const requestLogsReducer = createSlice({
  name: 'requestLogs',
  initialState: initialRequestLogsState,
  reducers: {
    loadSuccess (state, { payload: { id, data, totalPages, totalRecords, currentPage, pageSize }}) {
      state.isLoading = false;
      state.logsByEndPoint[id] = data;
      state.metaByEndPoint[id] = { totalPages, totalRecords, currentPage, pageSize };
    },

    loadFailure (state, { payload }) {
      state.isLoading = false;
      state.error = payload;
    },

    loadStart (state) {
      state.isLoading = true;
    }
  }
});

const { actions, reducer } = requestLogsReducer;

export default reducer;
export const { loadSuccess, loadFailure, loadStart } = actions;

export const loadLogs = (id, page, pageSize) => async dispatch => {
  try {
    dispatch(loadStart(id));
    const response = await getRequestLogs(id, page, pageSize);
    dispatch(loadSuccess({ id, ...response }));
  } catch ({ message, response: { status, statusText, data, headers }}) {
    dispatch(loadFailure({
      error: {
        message,
        response: { status, statusText, data, headers }
      }
    }));
  }
}