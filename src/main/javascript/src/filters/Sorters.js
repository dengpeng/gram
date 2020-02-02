import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sort, sortableFields } from './sorterSlice'
import { TextField, MenuItem, IconButton } from '@material-ui/core'
import SortIcon from '@material-ui/icons/Sort';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    display: 'flex'
  },

  sorterSelect: {
    minWidth: 150,
  },

  sorterDir: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1)
  },

  ascending: {
    transform: 'scaleY(-1)',
  }
}));

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const sorter = useSelector(state => state.sorter);

  const handleChange = e => {
    dispatch(sort({
      ...sorter,
      field: e.target.value
    }));
  }

  const toggleDirection = () => {
    dispatch(sort({
      ...sorter,
      ascending: !sorter.ascending
    }))
  }

  return (
    <div className={classes.root}>
      <TextField id="sorters" select label="Sort by" value={sorter.field} onChange={handleChange} className={classes.sorterSelect}>
        {Object.entries(sortableFields).map(([key, value]) => <MenuItem value={key} key={key}>{value}</MenuItem>)}
      </TextField>
      <IconButton size="small" className={classes.sorterDir} onClick={toggleDirection}>
        {/* {sorter.ascending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />} */}
        <SortIcon className={sorter.ascending && classes.ascending} />
      </IconButton>
    </div>
  )
}