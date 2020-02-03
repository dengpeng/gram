import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearLogs } from '../requestLogs/requestLogsSlice';
import { Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/ClearAll';
import ErrorIcon from '@material-ui/icons/Error';

export default ({endPoint, viewReqLogs}) => {
  const [clearLogsTimeout, setClearLogsTimeout] = useState(null);
  const dispatch = useDispatch();
  const hasLogs = useSelector(({ logs }) => (logs.logsByEndPoint[endPoint.id] || []).length > 0);

  const resetClearLogs = () => {
    if (clearLogsTimeout) {
      clearTimeout(clearLogsTimeout);
      setClearLogsTimeout(null);
    }
  }

  useEffect(() => () => {
    resetClearLogs();
  });

  const onClearLogs = () => { setClearLogsTimeout(setTimeout(() => setClearLogsTimeout(null), 2000)) }
  const onConfirmClearLogs = () => { dispatch(clearLogs(endPoint.id)); }
  
  if (!viewReqLogs) {
    return null;
  }
  
  if  (clearLogsTimeout) {
    return <Button size="small" variant="contained" disabled={!hasLogs} disableElevation startIcon={<ErrorIcon />}
                   onClick={onConfirmClearLogs} color="secondary">Confirm</Button>
  } else {
    return <Button size="small" variant="contained" disabled={!hasLogs} disableElevation startIcon={<ClearIcon />} 
                   onClick={onClearLogs}>Clear Logs</Button>
  }
}