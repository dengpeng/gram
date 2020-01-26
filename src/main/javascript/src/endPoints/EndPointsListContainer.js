import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadEndPoints } from './endPointsSlice';
import EndPointsList from './EndPointsList';
import { CircularProgress, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(5)
  }
}));

export default () => {
  const dispatch = useDispatch();

  const [ 
    isLoadingData, 
    dataError,
    isLoadingEnums,
    enumsError 
   ] = useSelector(({ endPoints, enums }) => [ endPoints.isLoading, endPoints.error, enums.isLoading, enums.error ]);

  useEffect(() => {
    dispatch(loadEndPoints());
  }, [ dispatch ]);

  const classes = useStyles();  

  if (dataError || enumsError) {
    return (
      <Container maxWidth="md">
        <h1>Oops, something went wrong ...</h1>
        <div>{dataError && dataError.toString()}</div>
        <div>{enumsError && enumsError.toString()}</div>
      </Container>
    );
  }

  if (isLoadingData || isLoadingEnums) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <EndPointsList />
  )
};
