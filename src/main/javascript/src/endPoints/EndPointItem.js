import React, { useState, useEffect } from 'react';
import { startUpdate, update, select, remove } from './endPointsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ExpansionPanel, 
  ExpansionPanelActions,
  Button,
  Box,
  Divider,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';
import EndPointPanelDetails from './EndPointPanelDetails'
import EndPointPanelSummary from './EndPointPanelSummary'

const useStyles = makeStyles(theme => ({
  root: {
    '& .dimmable > *': {
      opacity: ({active}) => active ? 1 : 0.5
    }
  }
}));

export default ({ endPoint }) => {
  const { id, active } = endPoint;
  const dispatch = useDispatch();
  const classes = useStyles({ active });

  const [currentEndPoint, httpStatus] = useSelector(({endPoints, enums}) =>
    [endPoints.currentEndPoint, enums.httpStatus]
  );

  const [removeTimeout, setRemoveTimeout] = useState(null);

  const resetRemove = () => {
    if (removeTimeout) {
      clearTimeout(removeTimeout);
      setRemoveTimeout(null);
    }
  }

  useEffect(() => resetRemove); // reset as cleanup

  const onSelect = () => { dispatch(select(id)); };
  const onRemove = () => { setRemoveTimeout(setTimeout(() => setRemoveTimeout(null), 2000)) }
  const onConfirmRemove = () => { dispatch(remove(id)); }
  const onEdit = () => { dispatch(startUpdate(id)); }
  const onToggle = () => {
    dispatch(update({ 
      ...endPoint,
      active: !endPoint.active
    }));
  }

  return (
    <ExpansionPanel expanded={id === currentEndPoint} onChange={onSelect} className={classes.root} TransitionProps={{ timeout: 200 }}>
      <EndPointPanelSummary endPoint={endPoint} httpStatus={httpStatus} />
      <Divider />
      <EndPointPanelDetails endPoint={endPoint} />
      <Divider />
      <ExpansionPanelActions>
        <FormControlLabel control={<Switch checked={active} onChange={onToggle} value="checkedA" color="primary" />} label={active ? 'Active':'Inactive'} />
        <Box flexGrow={1}></Box>
        { 
          removeTimeout ?
          <Button size="small" variant="contained" disableElevation startIcon={<ErrorIcon />} onClick={onConfirmRemove} color="secondary">Confirm</Button>
          : 
          <Button size="small" variant="contained" disableElevation startIcon={<DeleteIcon />} onClick={onRemove}>Remove</Button>
        }
        <Button size="small" variant="contained" disableElevation startIcon={<EditIcon />} onClick={onEdit}>Edit</Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  )
}