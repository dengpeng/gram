import { combineReducers } from '@reduxjs/toolkit';
import endPointsReducer from '../endPoints/endPointsSlice';
import filterReducer from '../filters/filtersSlice';
import sorterReducer from '../filters/sorterSlice';
import enumsReducer from '../enums/enumsSlice';

export default combineReducers({
  endPoints: endPointsReducer,
  filters: filterReducer,
  sorter: sorterReducer,
  enums: enumsReducer
});