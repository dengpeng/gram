import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { loadLogs } from '../requestLogs/requestLogsSlice'
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
    padding: theme.spacing(1, 2),
    flexGrow: 1,
    overflow: 'auto'
  }
}))

export default ({ endPoint, logs, isLoadingLogs }) => {
  const classes = useStyles();
  const [viewReqLogs, setViewReqLogs] = useState(false);
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
        <div className={classes.responseBody}>
          {isLoadingLogs ? <pre>Loading ...</pre> :
            <pre>{logs.map(log => new Date(log.timeStamp).toUTCString() + " - " + log.remoteAddress + "\n")}</pre> // TODO
          }
        </div>
        :
        <div className={classes.responseBody}>
          <pre>{endPoint.response}</pre>
        </div>
      }
    </ExpansionPanelDetails>
  )
}
