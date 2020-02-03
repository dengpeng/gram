import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { remove } from './endPointsSlice';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';

export default ({endPoint}) => {
  const [removeTimeout, setRemoveTimeout] = useState(null);
  const dispatch = useDispatch();

  const resetRemove = () => {
    if (removeTimeout) {
      clearTimeout(removeTimeout);
      setRemoveTimeout(null);
    }
  }

  useEffect(() => () => {
    resetRemove();
  });

  const onRemove = () => { setRemoveTimeout(setTimeout(() => setRemoveTimeout(null), 2000)) }
  const onConfirmRemove = () => { dispatch(remove(endPoint.id)); }

  if  (removeTimeout) {
    return <Button size="small" variant="contained" disableElevation startIcon={<ErrorIcon />}
                   onClick={onConfirmRemove} color="secondary">Confirm</Button>
  } else {
    return <Button size="small" variant="contained" disableElevation startIcon={<DeleteIcon />} 
                   onClick={onRemove}>Remove</Button>
  }
}