import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterPath } from './filtersSlice'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    width: 200
  },
}));

export default () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const pathFilter = useSelector(state => state.filters.path);

  const onChange = e => {
    dispatch(filterPath(e.target.value));
  }

  const onClear = () => {
    dispatch(filterPath(''));
  }

  return (
    <TextField
      className={classes.textField}
      id="path-filter-text"
      label="Filter API-Path"
      value={pathFilter}
      onChange={onChange}
      InputLabelProps={{shrink: true}}
      InputProps={pathFilter ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onClear} size="small">
              <ClearIcon fontSize="inherit" />
            </IconButton>
          </InputAdornment>
        )
      } : {}}
    />
  )
}