import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { loadLogs } from '../requestLogs/requestLogsSlice'
import EndPointPanelLogs from './EndPointPanelLogs'
import { 
  ExpansionPanelDetails,
  Tabs,
  Tab
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'column',
    height: theme.spacing(30),
    padding: theme.spacing(0, 0, 0, 0),
  },
  detailTabs: {
    backgroundColor: theme.palette.grey[50],
    minHeight: theme.spacing(5),
    '& button': { minHeight: theme.spacing(5) }
  },
  responseBody: {
    margin: 0,
    padding: theme.spacing(2),
    overflow: 'auto',
    fontSize: 12,
    lineHeight: '1.25em',
    '& pre': { margin: 0 }
  }
}))

export default ({ endPoint, viewReqLogs, setViewReqLogs }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onRefreshLog = () => {
    dispatch(loadLogs(endPoint.id));
  }

  return (
    <ExpansionPanelDetails className={classes.root + " dimmable"}>
      <Tabs value={viewReqLogs ? 1 : 0} onChange={(e, newValue) => setViewReqLogs(newValue)}
            indicatorColor="secondary" textColor="primary" className={classes.detailTabs} >
        <Tab label="Response" />
        <Tab label="Request Logs" onClick={onRefreshLog} />
      </Tabs>
      {viewReqLogs ?
        <EndPointPanelLogs endPoint={endPoint} />
        :
        <div className={classes.responseBody}>
          <pre><code>{endPoint.response}</code></pre>
        </div>
      }
    </ExpansionPanelDetails>
  )
}
