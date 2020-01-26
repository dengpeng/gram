import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endEdit, update, create } from './endPointsSlice'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Button
} from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles';
import { mockRoot } from '../api'

const pathRegExp = /^[\w\-/.]+$/;
const formDataDefault = { path: '', method: 'GET', status: 'OK', contentType: 'application/json', delay: 0, response: '', active: false };

const useStyles = makeStyles(theme => ({
  actionBar: {
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(2)
  },
  pathPrefix: {
    marginRight: '2px'
  }
}));

export default () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [
    dataInEdit, 
    { isLoading: isLoadingEnums, httpStatus, httpMethods, contentTypes }
   ] = useSelector(({ endPoints: { inEdit, endPointsById }, enums}) => {
    return [
      inEdit === null ? null: (endPointsById[inEdit] || formDataDefault),
      enums
    ];
  });

  const [formData, setFormData] = useState(formDataDefault)
  const [pathInvalid, setPathInvalid] = useState(false);

  useEffect(() => {
    setFormData(dataInEdit || formDataDefault);    
  }, [dataInEdit]);

  const isCreating = !formData.id;

  const onCancel = () => {
    dispatch(endEdit())
  }

  const onSave = () => {
    if (!pathRegExp.test(formData.path)) {
      setPathInvalid(true);
      return;
    }

    if (isCreating) {
      dispatch(create(formData));
    } else {
      dispatch(update(formData));
    }
  }

  const onFieldChange = e => {
    if (e.target.name === 'path' && e.target.value) {
      setPathInvalid(false);
    }
    setFormData({
      ...formData,
      [e.target.name] : e.target.value 
    });
  }
  
  const { method, path, status, contentType, delay, response } = formData;

  if (isLoadingEnums) {
    return null;
  }


  return (
    <Dialog open={dataInEdit != null} onClose={onCancel}>
      <DialogTitle id="form-dialog-title">{isCreating ? 'New' : 'Edit'} Mock End Point</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText> */}
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField id="edit-method" name="method" select label="Request Method" value={method} fullWidth onChange={onFieldChange}>
              {httpMethods.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8}>
            <TextField id="edit-path" name="path" label="Request Path" fullWidth value={path} onChange={onFieldChange}
                       error={pathInvalid} helperText={pathInvalid ? 'Path is invalid' : ''}
                       InputProps={{ startAdornment: <InputAdornment position="start" className={classes.pathPrefix}>{mockRoot}</InputAdornment> }} />
          </Grid>
          <Grid item xs={4}>
            <TextField id="edit-status" name="status" select label="Response Status" value={status} fullWidth onChange={onFieldChange}>
              {Object.entries(httpStatus).map(([ key, { _, code, text }]) => (
                <MenuItem key={key} value={key}>
                  {code} {text}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField id="edit-content-type" name="contentType" select label="Content-Type" value={contentType} fullWidth onChange={onFieldChange}>
              {Object.entries(contentTypes).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField id="edit-delay" name="delay" label="Delay" type="number" value={delay} fullWidth onChange={onFieldChange} 
                       InputProps={{ endAdornment: <InputAdornment position="end">ms</InputAdornment> }} />
          </Grid>
          <Grid item xs={12}>
            <TextField id="edit-response" name="response" label="Response Body" multiline fullWidth 
                       rows="6" value={response} onChange={onFieldChange} 
                       InputLabelProps={{shrink: true}}
                       InputProps={{ style: { fontFamily: 'Monospace' } }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actionBar}>
        <Button onClick={onCancel} startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained" startIcon={<DoneIcon />}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}