import React from 'react'
import { Container, Grid } from '@material-ui/core'
import VisibilityFilter from './VisibilityFilter'
import PathFilter from './PathFilter'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
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
          {/* <FormControl className={classes.formControl}>
              <InputLabel id="visibility-filter-label">Sort by</InputLabel>
              <Select labelId="visibility-filter-label" id="visibility-filter-select">
                <MenuItem value={0}>Path</MenuItem>
                <MenuItem value={1}>Method</MenuItem>
                <MenuItem value={1}>Method</MenuItem>
              </Select>
            </FormControl> */}
        </Grid>
      </Grid>
    </Container>
  )
}