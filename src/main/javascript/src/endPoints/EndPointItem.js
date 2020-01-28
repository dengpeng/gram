import React, { useState, useEffect } from 'react';
import { startUpdate, update, select, remove } from './endPointsSlice';
import { loadLogs } from '../requestLogs/requestLogsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ExpansionPanel, 
  ExpansionPanelSummary,
  ExpansionPanelDetails, 
  ExpansionPanelActions,
  Tabs,
  Tab,
  Button,
  IconButton,
  Box,
  Chip, 
  Divider,
  Switch,
  Tooltip,
  Typography 
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import CopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import { mockRoot, getHost } from '../api'

const useStyles = makeStyles(theme => ({
  root: {
    '& .dimmable > *': {
      opacity: ({active}) => active ? 1 : 0.5
    }
  },
  method: {
    flexBasis: theme.spacing(11)
  },
  path: {
    flexGrow: 1,
    '& h6': { display: 'inline-block' },
    '& .pathCopy': { display: 'none', marginLeft: theme.spacing(1) },
    '&:hover .pathCopy': { display: 'inline-block' }
  },
  
  pathPrefix: { color: theme.palette.grey[500] },
  rspProp: {
    '& div': { margin: theme.spacing(0, .5) }
  },
  methodChip: { 
    width: theme.spacing(9),
    fontSize: ({method}) => {
      if (method === 'DELETE') {
        return '0.75rem';
      } else if (method === 'OPTIONS') {
        return '0.65rem';
      } else {
        return theme.typography.button.fontSize;
      }
    },
    backgroundColor: ({method}) => {
      switch (method) {
        case 'GET': return theme.palette.success.light;
        case 'POST': return theme.palette.info.light;
        case 'PUT': return theme.palette.warning.light;
        case 'DELETE': return theme.palette.error.light;
        default: return theme.palette.grey[300];
       }
    }
  },
  delayChip: {
    backgroundColor: ({delay}) => {
      if (delay <= 0) {
        return theme.palette.grey[300];
      } else if (delay <= 500) {
        return theme.palette.success.light;
      } else if (delay <= 1000) {
        return theme.palette.info.light;
      } else if (delay <= 2000) {
        return theme.palette.warning.light;
      } else {
        return theme.palette.error.light;
      }
    }
  },
  statusChip: {
    backgroundColor: ({statusCode}) => {
      if (statusCode < 200) {
        return theme.palette.info.light
      } else if (statusCode < 300) {
        return theme.palette.success.light;
      } else if (statusCode < 400) {
        return theme.palette.warning.light;
      } else if (statusCode < 500) {
        return theme.palette.error.light;
      } else {
        return theme.palette.grey[500];
      }
    }
  },
  details: {
    flexDirection: 'column',
    height: theme.spacing(20),
    padding: theme.spacing(0, 0, 2, 0),
  },
  detailTabs: {
    backgroundColor: theme.palette.grey[50],
    minHeight: theme.spacing(5),
    '& button': { minHeight: theme.spacing(5) }
  },
  responseBody: {
    padding: theme.spacing(1, 2, 0, 2),
    flexGrow: 1,
    overflow: 'auto'
  }
}));

export default ({ endPoint }) => {
  const { id, method, path, status, contentType, delay, response, active } = endPoint;

  const [currentEndPoint, httpStatus, logs, isLoadingLogs] = useSelector(
    ({endPoints, enums, logs}) => [ endPoints.currentEndPoint, enums.httpStatus, logs.logsByEndPoint[endPoint.id], logs.isLoading]
  );
  const statusCode = httpStatus[status] ? httpStatus[status].code : 0;
  const dispatch = useDispatch();
  const classes = useStyles({ method, delay, statusCode, active });
  const [removeTimeout, setRemoveTimeout] = useState(null);
  const [viewReqLogs, setViewReqLogs] = useState(false);

  const resetRemove = () => {
    if (removeTimeout) {
      clearTimeout(removeTimeout);
      setRemoveTimeout(null);
    }
  }

  useEffect(() => resetRemove); // reset as cleanup

  const onSelect = () => { dispatch(select(id)); };
  const onRemove = () => { setRemoveTimeout(setTimeout(() => setRemoveTimeout(null), 2000)) }
  const onConfirmRemove = () => { dispatch(remove(id)); }
  const onEdit = () => { dispatch(startUpdate(id)); }
  const onPathCopy = e => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(getHost() + mockRoot + path);
  }
  const onToggle = () => {
    dispatch(update({ 
      ...endPoint,
      active: !endPoint.active
    }));
  }
  const onRefreshLog = () => {
    dispatch(loadLogs(endPoint.id));
  }

  const contentTypeShort = contentType.substring(contentType.indexOf('/') + 1).toUpperCase();

  return (
    <ExpansionPanel expanded={id === currentEndPoint} onChange={onSelect} className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} id={"panelbh-header-" + id} className="dimmable">
        <div className={classes.method}><Chip label={method} className={classes.methodChip} /></div>
        <div className={classes.path}>
          <Typography variant="h6"><span className={classes.pathPrefix}>{mockRoot}</span>{path}</Typography>
          <IconButton size="small" className="pathCopy" onClick={onPathCopy}>
            <CopyIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div className={classes.rspProp}>
          <Chip label={contentTypeShort} />
          <Chip className={classes.statusChip} label={statusCode} />
          <Chip className={classes.delayChip} label={delay + ' ms'} />
        </div>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails className={classes.details + " dimmable"}>
        <Tabs value={viewReqLogs ? 1 : 0} onChange={(e, newValue) => setViewReqLogs(newValue) } 
              indicatorColor="primary" textColor="primary" className={classes.detailTabs} >
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
            <pre>{response}</pre>
          </div>
        }
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Tooltip title={active ? 'Deactivate' : 'Activate'} placement="right">
          <Switch checked={active} onChange={onToggle} value="checkedA" color="primary" />
        </Tooltip>
        <Box flexGrow={1}></Box>
        { 
          removeTimeout ?
          <Button size="small" variant="contained" disableElevation startIcon={<ErrorIcon />} onClick={onConfirmRemove} color="secondary">Confirm</Button>
          : <Button size="small" variant="contained" disableElevation startIcon={<DeleteIcon />} onClick={onRemove}>Remove</Button>
        }
        <Button size="small" variant="contained" disableElevation startIcon={<EditIcon />} onClick={onEdit}>Edit</Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  )
}