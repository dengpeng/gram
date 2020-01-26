import React from 'react'
import { Container, Grid } from '@material-ui/core'
import VisibilityFilter from './VisibilityFilter'
import PathFilter from './PathFilter'
import Sorters from './Sorters'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3)
  }
}));

export default () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <VisibilityFilter />
          <PathFilter />
        </Grid>
        <Grid item xs={4}>
          <Sorters />
        </Grid>
      </Grid>
    </Container>
  )
}