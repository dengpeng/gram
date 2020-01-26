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
    createSuccess: (state, { payload }) => {
      state.endPointsById[payload.id] = payload;
      state.inEdit = null;
    },
    updateSuccess: (state, { payload }) => {
      payload.forEach(endPoint => { state.endPointsById[endPoint.id] = endPoint });
      state.inEdit = null;
    },
    removeSuccess: (state, { payload }) => { delete state.endPointsById[payload] },
    createFailure: (state, { payload }) => { console.log ('Create item failed', payload) },
    updateFailure: (state, { payload }) => { console.log ('update item failed', payload) },
    removeFailure: (state, { payload }) => { console.log ('Remove item failed', payload) },
    startUpdate: (state, { payload }) => { state.inEdit = payload },
    startCreate: (state) => { state.inEdit = 0 },
    endEdit: (state) => { state.inEdit = null }
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

  } catch (err) {
    dispatch(loadFailure(err.toString()));
  }
};

export const remove = (id) => async dispatch => {
  try {
    const success = await deleteEndPoint(id);
    if (success) {
      dispatch(removeSuccess(id));
    } else {
      dispatch(removeFailure(id));
    }
  } catch (err) {
    dispatch(removeFailure(err));
  }
}

export const update = (endPoint) => async dispatch => {
  try {
    const endPoints = await updateEndPoint(endPoint);
    dispatch(updateSuccess(endPoints));
  } catch (err) {
    dispatch(updateFailure(err));
  }
}

export const create = (endPoint) => async dispatch => {
  try {
    const newEndPoint = await createEndPoint(endPoint);
    dispatch(createSuccess(newEndPoint));
  } catch (err) {
    dispatch(createFailure(err));
  }
}