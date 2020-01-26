import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { visibilityFilters, filterVisibility } from './filtersSlice'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, MenuItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 100,
  }
}));

export default () => {
  const dispatch = useDispatch();
  const visibilityFilter = useSelector(state => state.filters.visibility);
  const classes = useStyles();

  const handleChange = e => {
    dispatch(filterVisibility(e.target.value));
  }

  const filterOptions = Object.entries(visibilityFilters);

  return (
    <TextField id="vis-filter" select label="View" value={visibilityFilter} onChange={handleChange} className={classes.formControl}>
      {filterOptions.map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
    </TextField>
  )
}
