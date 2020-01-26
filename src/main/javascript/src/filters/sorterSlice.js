import { createSlice } from '@reduxjs/toolkit';

export const sortableFields = {
  path: 'Path',
  delay: 'Delay',
  method: 'Request Method'
}

const sorterInitialState = {
  field: 'path',
  ascending: false
}

const sorterSlice = createSlice({
  name: 'sorterSlice',
  initialState: sorterInitialState,
  reducers: {
    sort: (state, { payload: { field, ascending }}) => {
      if (sortableFields[field]) state.field = field;
      state.ascending = !!ascending
    }
  }
})

const { actions, reducer } = sorterSlice;

export const { sort } = actions;

export default reducer;

