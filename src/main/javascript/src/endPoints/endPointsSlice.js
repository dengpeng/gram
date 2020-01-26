import { createSlice } from '@reduxjs/toolkit';
import { 
  getEndPoints, 
  deleteEndPoint, 
  updateEndPoint, 
  createEndPoint
} from '../api';

const endPointsInitialState = {
  endPointsById: {},
  currentEndPoint: null,
  isLoading: false,
  inEdit: null,
  error: null
};

const endPointsSlice = createSlice({
  name: 'endPointsSlice',
  initialState: endPointsInitialState,
  reducers: {
    loadStart: state => {
      state.isLoading = true;
    },
    loadSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.endPointsById = {};

      payload.forEach(endPoint => { state.endPointsById[endPoint.id] = endPoint });
    },
    loadFailure: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },

    select: (state, { payload }) => {
      if (state.currentEndPoint === payload) {
        state.currentEndPoint = null;
      } else {
        state.currentEndPoint = payload;
      }
    },

    startCreate: state => { state.inEdit = 0 },
    createSuccess: (state, { payload }) => {
      state.endPointsById[payload.id] = payload;
      state.inEdit = null;
    },
    createFailure: (state, { payload: { error } }) => { 
      state.inEdit = null;
      console.log ('Create failed:', error.message) 
    },

    startUpdate: (state, { payload }) => { state.inEdit = payload },
    updateSuccess: (state, { payload }) => {
      payload.forEach(endPoint => { state.endPointsById[endPoint.id] = endPoint });
      state.inEdit = null;
    },
    updateFailure: (state, { payload: { error, endPoint }}) => { 
      state.inEdit = null;
      if (error.response && error.response.status === 404) {
        delete state.endPointsById[endPoint.id];
      }
      console.log ('Update failed:', error.message) 
    },

    removeSuccess: (state, { payload }) => { delete state.endPointsById[payload.id] },
    removeFailure: (state, { payload: { error, id } }) => { 
      if (error.response && error.response.status === 404) {
        delete state.endPointsById[id];
      }
      console.log('Remove failed:', error.message)
    },

    endEdit: state => { state.inEdit = null }
  }
});

const { actions, reducer } = endPointsSlice;

export const { 
  loadStart,
  loadSuccess,
  loadFailure,
  select,
  createSuccess, 
  updateSuccess, 
  removeSuccess,
  createFailure, 
  updateFailure, 
  removeFailure,
  startUpdate,
  startCreate,
  edit,
  endEdit
} = actions;

export default reducer;

// Thunk actions

export const loadEndPoints = () => async dispatch => {
  try {
    dispatch(loadStart());
    const endPoints = await getEndPoints ();
    dispatch(loadSuccess(endPoints));

  } catch ({ message, response: { status, statusText, data, headers }}) {
    dispatch(loadFailure({
      error: {
        message,
        response: { status, statusText, data, headers }
      }
    }));
  }
};

export const remove = (id) => async dispatch => {
  try {
    const endPoint = await deleteEndPoint(id);
    dispatch(removeSuccess(endPoint));
  } catch ({ message, response: { status, statusText, data, headers }}) {
    dispatch(removeFailure({ 
      error: { 
        message, 
        response: { status, statusText, data, headers } 
      }, 
      id: id 
    }));
  }
}

export const update = (endPoint) => async dispatch => {
  try {
    const endPoints = await updateEndPoint(endPoint);
    dispatch(updateSuccess(endPoints));
  } catch ({ message, response: { status, statusText, data, headers }}) {
    dispatch(updateFailure({ 
      error: { 
        message, 
        response: { status, statusText, data, headers } 
      },
      endPoint
    }));
  }
}

export const create = (endPoint) => async dispatch => {
  try {
    const newEndPoint = await createEndPoint(endPoint);
    dispatch(createSuccess(newEndPoint));
  } catch ({ message, response: { status, statusText, data, headers }}) {
    dispatch(updateFailure({ 
      error: { 
        message, 
        response: { status, statusText, data, headers } 
      },
      endPoint
    }));
  }
}