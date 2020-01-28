import { createSlice } from '@reduxjs/toolkit';
import { getRequestLogs } from '../api'

const initialRequestLogsState = {
  logsByEndPoint : {},
  isLoading: false,
  error: null
}

const requestLogsReducer = createSlice({
  name: 'requestLogs',
  initialState: initialRequestLogsState,
  reducers: {
    loadSuccess (state, { payload }) {
      state.isLoading = false;
      state.logsByEndPoint[payload.id] = payload.logs;
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

export const loadLogs = (id) => async dispatch => {
  try {
    dispatch(loadStart(id));
    const logs = await getRequestLogs(id);
    dispatch(loadSuccess({ id, logs }));
  } catch ({ message, response: { status, statusText, data, headers }}) {
    dispatch(loadFailure({
      error: {
        message,
        response: { status, statusText, data, headers }
      }
    }));
  }
}