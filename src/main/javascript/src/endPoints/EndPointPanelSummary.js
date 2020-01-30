import React from 'react'

import { 
  ExpansionPanelSummary,
  Chip,
  IconButton,
  Typography
 } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import { mockRoot, getHost } from '../api'

const useStyles = makeStyles(theme => ({
  method: {
    flexBasis: theme.spacing(11)
  },
  path: {
    flexGrow: 1,
    '& h6': { display: 'inline-block' },
    '& .pathCopy': { display: 'none', marginLeft: theme.spacing(1) },
    '&:hover .pathCopy': { display: 'inline-block' }
  },
  pathPrefix: { 
    color: theme.palette.grey[500] 
  },
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
  }
}));

export default ({ endPoint: {id, method, path, delay, status, contentType}, httpStatus }) => {
  const statusCode = httpStatus[status] ? httpStatus[status].code : 0;
  const classes = useStyles({ method, delay, statusCode });
  const contentTypeShort = contentType.substring(contentType.indexOf('/') + 1).toUpperCase();

  const onPathCopy = e => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(getHost() + mockRoot + path);
  }

  return (
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
  )
}

