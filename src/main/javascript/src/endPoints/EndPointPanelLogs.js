import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { loadLogs } from '../requestLogs/requestLogsSlice'
import { List, ListItem, ListItemText, CircularProgress, Paper, IconButton, Typography } from '@material-ui/core'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0
  },
  list: {
    alignSelf: 'stretch', marginTop: '2px'
  },
  pagerScroll: {
    alignSelf: 'start',
    width: '2px',
    backgroundColor: theme.palette.secondary.main,
    transition: 'height 0.3s, margin-top 0.3s',
    height: ({totalPages}) => (1/totalPages) * 200 + 'px',
    marginTop: ({currentPage, totalPages}) => {
       return 200 * (currentPage - 1) / totalPages + 'px'
    },
  },
  pager: {
    display: 'flex', flexDirection: 'column', marginRight: theme.spacing(1)
  },
  rotatedIcon: { transform: 'rotate(90deg)' },
  logDetails: {
    flexGrow: 1,
    alignSelf: 'stretch',
    height: theme.spacing(23),
    margin: theme.spacing(1),
    overflow: 'auto',
    '& >ul': { margin: theme.spacing(0, 2), padding: 0, listStyle: 'none', lineHeight: '1.5em' },
    '& .inlineValue': { display: 'inline-block', fontFamily: 'monospace', marginLeft: theme.spacing(2) },
    '& pre': { margin: theme.spacing(0, 0, 0, 1), lineHeight: '1.25em' }
  },
  label: { display: 'inline-block', color: theme.palette.primary.main, marginTop: theme.spacing(1) },
  queryParams: { 
    listStyle: 'none', paddingLeft: theme.spacing(2), fontFamily: 'monospace' ,
    '& li': { lineHeight: '1.25em' },
    '& .paramKey': { fontWeight: theme.typography.fontWeightMedium },
    '& .paramValue': {},
  },

}))

export default ({endPoint}) => { 
  const dispatch = useDispatch();
  const [logs, meta, isLoading] = useSelector(
    ({logs: {logsByEndPoint, metaByEndPoint, isLoading}}) => [logsByEndPoint[endPoint.id], metaByEndPoint[endPoint.id], isLoading]
  )
  const { currentPage, totalPages } = meta || {};
  const classes = useStyles({ currentPage, totalPages });
    
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading && !currentPage) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    )
  }

  const formatTimeStamp = timestamp => new Date(timestamp).toLocaleString('en', { hour12: false, timeStyle: 'medium', dateStyle: 'medium' });

  if (selectedIndex >= logs.length) {
    setSelectedIndex(logs.length - 1);
  }

  const currentLog = logs[selectedIndex];
  const isFirstPage = (currentPage === 1);
  const isLastPage = (currentPage === totalPages);

  const handPageChange = (page) => {
    dispatch(loadLogs(endPoint.id, page));
  }

  return (
    <div className={classes.root}>
      <div className={classes.pagerScroll} />
      <div className={classes.pager}>
        <IconButton size="small" disabled={isFirstPage} onClick={() => { handPageChange(1) }}>
          <FirstPageIcon className={classes.rotatedIcon} />
        </IconButton>
        <IconButton size="small" disabled={isFirstPage} onClick={() => { handPageChange(currentPage-1) }}>
          <ArrowUpIcon />
        </IconButton>
        {/* <Typography variant="button" align="center" display="block">1</Typography>
        <Typography variant="button" align="center" display="block">2</Typography> */}
        <IconButton size="small" disabled={isLastPage} onClick={() => { handPageChange(currentPage+1) }}>
          <ArrowDownIcon />
        </IconButton>
        <IconButton size="small" disabled={isLastPage} onClick={() => { handPageChange(totalPages) }}>
          <LastPageIcon className={classes.rotatedIcon} />
        </IconButton>
      </div>
      <List dense className={classes.list}>
        {logs.map((log, index) => (
          <ListItem button key={index} selected={selectedIndex === index} onClick={() => setSelectedIndex(index)}>
            <ListItemText>{formatTimeStamp(log.timeStamp)}</ListItemText>
          </ListItem>
        ))}
      </List>
      { currentLog &&
      <Paper variant="outlined" className={classes.logDetails}>
        <ul>
          <li>
            <Typography variant="overline" className={classes.label}>Remote Address</Typography>
            <span className="inlineValue">{currentLog.remoteAddress}</span>
          </li>
          <li><Typography variant="overline" className={classes.label}>Query Parameters</Typography>
            <ul className={classes.queryParams}>
              {Object.entries(currentLog.queryParams).map(([key, value]) => (
                <li key={key} ><span className="paramKey">{key}</span>: <span className="paramValue">{value.length === 1 ? value[0] : value.join(', ')}</span></li>
              ))}
            </ul>
          </li>
          <li><Typography variant="overline" className={classes.label}>Request Body</Typography>
            <pre>{currentLog.body}</pre>
          </li>
        </ul>
      </Paper>}
    </div>
  )
  
}
