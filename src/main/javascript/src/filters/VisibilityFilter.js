import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { visibilityFilters, filterVisibility } from './filtersSlice'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
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
    <FormControl className={classes.formControl}>
      <InputLabel id="visibility-filter-label">View</InputLabel>
      <Select
        labelId="visibility-filter-label"
        id="visibility-filter-select"
        value={visibilityFilter}
        onChange={handleChange}
      >
        {filterOptions.map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
