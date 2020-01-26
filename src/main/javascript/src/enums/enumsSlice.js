import { createSlice } from '@reduxjs/toolkit';
import { 
  getHttpStatus, 
  getHttpMethods, 
  getContentTypes 
} from '../api';

const enumsInitialState = {
  httpMethods: [], 
  httpStatus: {}, 
  contentTypes: {},
  isLoading: false,
  error: null
};

const enumsSlice = createSlice({
  name: 'enumsSlice',
  initialState: enumsInitialState,
  reducers: {
    loadStart: state => {
      state.isLoading = true;
    },
    loadSuccess: (state, {payload}) => {
      state.error = null;
      state.isLoading = false;
      state.httpMethods = payload.httpMethods;
      state.contentTypes = payload.contentTypes; 
      payload.httpStatus.forEach(status => state.httpStatus[status.key] = status);
    },
    loadFailure: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    }
  }
});

const { actions, reducer } = enumsSlice;

export const { 
  loadStart,
  loadSuccess,
  loadFailure
} = actions;

export default reducer;

export const loadEnums = () => async dispatch => {
  try {
    dispatch(loadStart());
    const [ methods, status, types ] = await Promise.all([
      getHttpMethods(),
      getHttpStatus(),
      getContentTypes()
    ]);
    dispatch(loadSuccess({
      httpMethods: methods,
      httpStatus: status,
      contentTypes: types
    }));
  } catch (err) {
    dispatch(loadFailure(err.toString()));
  }
}