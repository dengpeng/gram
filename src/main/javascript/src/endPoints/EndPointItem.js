import React, { useState } from 'react';
import { startUpdate, update, select } from './endPointsSlice';
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
import { makeStyles } from '@material-ui/core/styles';
import EndPointPanelDetails from './EndPointPanelDetails'
import EndPointPanelSummary from './EndPointPanelSummary'
import ClearLogsButton from './ClearLogsButton'
import RemoveButton from './RemoveButton'

const useStyles = makeStyles(theme => ({
  root: {
    '& .dimmable > *': {
      opacity: ({active}) => active ? 1 : 0.5
    }
  },
  actionBar: {
    paddingLeft: theme.spacing(2)
  }
}));

export default ({ endPoint }) => {
  const { id, active } = endPoint;
  const dispatch = useDispatch();
  const classes = useStyles({ active });

  const [currentEndPoint, httpStatus] = useSelector(({endPoints, enums}) =>
    [endPoints.currentEndPoint, enums.httpStatus]
  );

  const [viewReqLogs, setViewReqLogs] = useState(false);

  const onSelect = () => { dispatch(select(id)); };
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
      <EndPointPanelDetails endPoint={endPoint} viewReqLogs={viewReqLogs} setViewReqLogs={setViewReqLogs} />
      <Divider />
      <ExpansionPanelActions className={classes.actionBar}>
        <FormControlLabel control={<Switch checked={active} onChange={onToggle} value="checkedA" color="primary" />} label={active ? 'Active':'Inactive'} />
        <Box flexGrow={1}></Box>
        <ClearLogsButton endPoint={endPoint} viewReqLogs={viewReqLogs} />
        <RemoveButton endPoint={endPoint} />
        <Button size="small" variant="contained" disableElevation startIcon={<EditIcon />} onClick={onEdit}>Edit</Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  )
}