import React from 'react';
import { useDispatch } from 'react-redux';
import { downloadUrl } from '../api';
import { loadEndPoints, startCreate } from '../endPoints/endPointsSlice';
import { Typography, AppBar, Toolbar, IconButton, Container, Grid, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircle';
import RefreshIcon from '@material-ui/icons/Refresh';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PollIcon from '@material-ui/icons/Poll';
import { makeStyles, styled } from '@material-ui/core/styles';

const ActionButton = styled(IconButton)(({theme}) => ({
  color: theme.palette.grey[50]
}));

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    "& h5": { 
      marginLeft: theme.spacing(1), 
      fontWeight: 800,
      letterSpacing: 0,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
    }
  },
  actionBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
}));

export default () => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const onRefresh = e => {
    dispatch(loadEndPoints());
  }

  const onDownload = e => {
    let url = downloadUrl;
    if (process.env.NODE_ENV === 'development') {
      url = 'http://localhost:9000/' + url;
    }
    window.open(url);
  }

  const onAdd = () => {
    dispatch(startCreate());
  };

  return (
      <AppBar position="static">
        <Toolbar disableGutters>
          <Container maxWidth="md">
            <Grid container spacing={1}>
              <Grid item xs={9} className={classes.title} >
                <PollIcon fontSize="large" />
                <Typography variant="h5">GRAM</Typography>
              </Grid>
              <Grid item xs={3} className={classes.actionBtns}>
                <Tooltip title="Reload">
                  <ActionButton aria-label="refresh" onClick={onRefresh}><RefreshIcon /></ActionButton>
                </Tooltip>
                <Tooltip title="Downlad all data">
                  <ActionButton aria-label="download" onClick={onDownload}><DownloadIcon /></ActionButton>
                </Tooltip>
                <Tooltip title="Create end point">
                  <ActionButton aria-label="add" onClick={onAdd}><AddIcon /></ActionButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
  )
}
