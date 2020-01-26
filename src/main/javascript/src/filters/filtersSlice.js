import { createSlice } from '@reduxjs/toolkit';

export const visibilityFilters = {
  ALL: 'All',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
}

const filtersInitialState = {
  path: "",
  visibility: 'ALL'
}

const filtersSlice = createSlice({
  name: 'filtersSlice',
  initialState: filtersInitialState,
  reducers: {
    filterVisibility: (state, { payload }) => {
      if (visibilityFilters[payload]) {
        state.visibility = visibilityFilters[payload] ? payload : 'ALL'
      }
    },
    filterPath: (state, { payload }) => {
      state.path = payload
    }
  }
})

const { actions, reducer } = filtersSlice;

export const { filterVisibility, filterPath } = actions;

export default reducer;

