import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import createAxiosInstance from '../../apis/axiosConfig';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { isEmpty } from 'underscore';
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import { deleteDeviceApi } from 'views/apis/deviceRegistry';
import { loadDevicesData } from 'redux/DeviceRegistry/operations';
import { useDevicesData } from 'redux/DeviceRegistry/selectors';
import { updateMainAlert } from 'redux/MainAlert/operations';
import { updateDeviceBackUrl } from 'redux/Urls/operations';
import CustomMaterialTable from '../Table/CustomMaterialTable';
import ConfirmDialog from 'views/containers/ConfirmDialog';
import { REGISTER_DEVICE_URI } from 'config/urls/deviceRegistry';
import { humanReadableDate } from 'utils/dateTime';
import { useSitesData } from 'redux/SiteRegistry/selectors';
import { loadSitesData } from 'redux/SiteRegistry/operations';
import { createAlertBarExtraContentFromObject, dropEmpty } from 'utils/objectManipulators';
import ErrorBoundary from 'views/ErrorBoundary/ErrorBoundary';

// css
import 'assets/css/device-registry.css';
import { softCreateDeviceApi } from '../../apis/deviceRegistry';
import { withPermission } from '../../containers/PageAccess';
import { updateDeviceDetails } from '../../../redux/DeviceOverview/OverviewSlice';

// dropdown component
import Select from 'react-select';

import { setLoading as loadStatus, setRefresh } from 'redux/HorizontalLoader/index';
import UsersListBreadCrumb from '../../pages/UserList/components/Breadcrumb';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    height: 'auto',
    maxHeight: 'auto',
    overflow: 'visible',
    '&::-webkit-scrollbar': {
      width: '12px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#555'
    }
  },
  root: {
    padding: theme.spacing(3)
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  link: {
    color: '#3344AA',
    fontFamily: 'Open Sans'
  },

  table: {
    fontFamily: 'Open Sans'
  },
  modelWidth: {
    minWidth: 450
  },
  formControl: {
    height: 40,
    margin: '15px 0'
  },
  input: {
    color: 'black',
    fontFamily: 'Open Sans',
    fontweight: 500,
    font: '100px',
    fontSize: 17
  },
  paper: {
    minWidth: '400px',
    minHeight: '400px'
  },
  selectField: {
    height: 120,
    margin: '40 0'
    // border: "1px solid red"
  },
  fieldMargin: {
    margin: '20px 0'
  },
  button: {
    margin: '10px',
    width: '60px'
  },
  textFieldMargin: {
    margin: '15 0'
  },
  tableWrapper: {
    '& tbody>.MuiTableRow-root:hover': {
      background: '#EEE',
      cursor: 'pointer'
    }
  }
}));

// dropdown component styles
const customStyles = {
  control: (base, state) => ({
    ...base,
    height: '50px',
    marginTop: '8px',
    marginBottom: '8px',
    borderColor: state.isFocused ? '#3f51b5' : '#9a9a9a',
    '&:hover': {
      borderColor: state.isFocused ? 'black' : 'black'
    },
    boxShadow: state.isFocused ? '0 0 1px 1px #3f51b5' : null
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'white' : 'blue',
    textAlign: 'left'
  }),
  input: (provided, state) => ({
    ...provided,
    height: '40px',
    borderColor: state.isFocused ? '#3f51b5' : 'black'
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: '#000'
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 9999
  })
};

const Cell = ({ fieldValue }) => {
  return <div>{fieldValue || '-'}</div>;
};

const createDeviceColumns = (history, setDelState) => [
  {
    title: 'Device Name',
    render: (data) => <Cell fieldValue={data.long_name} />,
    field: 'long_name'
  },
  {
    title: 'Device ID',
    field: 'name',
    render: (data) => <Cell fieldValue={data.name} />
  },
  {
    title: 'Description',
    field: 'description',
    render: (data) => <Cell fieldValue={data.description} />
  },
  {
    title: 'Site',
    field: 'site.description',
    render: (data) => (
      <Cell
        fieldValue={
          data.site && (
            <Link
              to={`/sites/${data.site._id}`}
              className={'underline-hover'}
              onClick={(event) => {
                event.stopPropagation();
              }}>
              {data.site && data.site.description}
            </Link>
          )
        }
      />
    )
  },
  {
    title: 'Deployment Date',
    field: 'createdAt',
    render: (data) => <Cell data={data} fieldValue={humanReadableDate(data.deployment_date)} />
  },
  {
    title: 'Deployment status',
    field: 'status',
    render: (data) => {
      const deviceStatus = !data.status
        ? data.isActive === true
          ? 'deployed'
          : 'not deployed'
        : data.status;

      return (
        <Cell
          fieldValue={
            <span
              style={{
                color: deviceStatus === 'deployed' ? 'green' : 'red',
                textTransform: 'capitalize'
              }}>
              {deviceStatus}
            </span>
          }
        />
      );
    }
  },

  {
    title: 'Actions',
    render: (rowData) => (
      <div>
        <Tooltip title="Edit">
          <EditIcon
            className={'hover-blue'}
            style={{ margin: '0 5px' }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              history.push(`/device/${rowData.name}/edit`);
            }}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <DeleteIcon
            // className={"hover-red"}
            style={{ margin: '0 5px', cursor: 'not-allowed', color: 'grey' }}
            // disable deletion for now
            // onClick={(event) => {
            //   event.stopPropagation();
            //   setDelState({ open: true, name: rowData.name });
            // }}
          />
        </Tooltip>
      </div>
    )
  }
];

const CATEGORIES = [
  { value: 'lowcost', name: 'Lowcost' },
  { value: 'bam', name: 'BAM' },
  { value: 'gas', name: 'GAS' }
];

// categories options
const categoriesOptions = CATEGORIES.map((category) => ({
  value: category.value,
  label: category.name
}));

const CreateDevice = ({ open, setOpen }) => {
  const selectedNetwork = JSON.parse(localStorage.getItem('activeNetwork')).net_name;
  const classes = useStyles();
  const dispatch = useDispatch();
  const newDeviceInitState = {
    long_name: '',
    category: CATEGORIES[0].value,
    network: selectedNetwork
  };

  const initialErrors = {
    long_name: '',
    category: '',
    network: ''
  };

  const [newDevice, setNewDevice] = useState(newDeviceInitState);
  const [errors, setErrors] = useState(initialErrors);

  const userNetworks = JSON.parse(localStorage.getItem('userNetworks')) || [];
  const loaderStatus = useSelector((state) => state.HorizontalLoader.loading);

  const handleDeviceDataChange = (key) => (event) => {
    return setNewDevice({ ...newDevice, [key]: event.target.value });
  };

  const handleDropdownChange = (event, { name }) => {
    return setNewDevice({ ...newDevice, [name]: event.value });
  };

  const handleRegisterClose = () => {
    setOpen(false);
    setNewDevice({ long_name: '', category: CATEGORIES[0].value, network: selectedNetwork });
    setErrors({ long_name: '', category: '', network: '' });
  };

  const handleRegisterSubmit = (e) => {
    // Set loading to true when submitting
    dispatch(loadStatus(true));
    if (!isEmpty(userNetworks)) {
      const userNetworksNames = userNetworks.map((network) => network.net_name);

      if (!userNetworksNames.includes(newDevice.network)) {
        dispatch(
          updateMainAlert({
            message: `You are not a member of the ${newDevice.network} organisation. Only members of the org can add devices to it. Contact support if you think this is a mistake.`,
            show: true,
            severity: 'error'
          })
        );

        //clear the new device form
        setNewDevice({
          long_name: '',
          category: CATEGORIES[0].value,
          network: selectedNetwork
        });
        setErrors({ long_name: '', category: '', network: '' });

        // Set loading to false when done
        dispatch(loadStatus(false));

        return;
      } else {
        createAxiosInstance()
          .post(REGISTER_DEVICE_URI, dropEmpty(newDevice), {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((res) => res.data)
          .then((resData) => {
            handleRegisterClose();

            dispatch(loadStatus(false));

            if (!isEmpty(selectedNetwork)) {
              dispatch(loadDevicesData(selectedNetwork));
            }
            dispatch(
              updateMainAlert({
                message: `${resData.message}. ${
                  newDevice.network !== selectedNetwork
                    ? `Switch to the ${newDevice.network} organisation to see the new device.`
                    : ''
                }`,
                show: true,
                severity: 'success'
              })
            );

            dispatch(loadStatus(false));
            dispatch(setRefresh(true));
          })
          .catch((error) => {
            const errors = error.response && error.response.data && error.response.data.errors;
            setErrors(errors || initialErrors);
            dispatch(
              updateMainAlert({
                message: error.response && error.response.data && error.response.data.message,
                show: true,
                severity: 'error',
                extra: createAlertBarExtraContentFromObject(errors || {})
              })
            );
            // Set loading to false when done
            dispatch(loadStatus(false));
          });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleRegisterClose}
      aria-labelledby="form-dialog-title"
      aria-describedby="form-dialog-description">
      <DialogTitle id="form-dialog-title" style={{ textTransform: 'uppercase' }}>
        Add a device
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <form className={classes.modelWidth}>
          <TextField
            autoFocus
            margin="dense"
            label="Device Name"
            variant="outlined"
            value={newDevice.long_name}
            onChange={handleDeviceDataChange('long_name')}
            fullWidth
            required
            error={!!errors.long_name}
            helperText={errors.long_name}
          />

          <Select
            fullWidth
            label="Category"
            name="category"
            style={{ margin: '10px 0' }}
            options={categoriesOptions}
            styles={customStyles}
            defaultValue={newDevice.category}
            placeholder="Select a category"
            onChange={handleDropdownChange}
            SelectProps={{
              native: true,
              style: { width: '100%', height: '40px' }
            }}
            required
          />

          <TextField
            fullWidth
            margin="dense"
            label="Network"
            value={newDevice.network}
            variant="outlined"
            error={!!errors.network}
            helperText={errors.network}
            disabled
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Grid container alignItems="flex-end" alignContent="flex-end" justify="flex-end">
          <Button variant="contained" type="button" onClick={handleRegisterClose}>
            Cancel
          </Button>
          <Button
            disabled={loaderStatus}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleRegisterSubmit}
            style={{ margin: '0 15px' }}>
            Register
          </Button>
        </Grid>
        <br />
      </DialogActions>
    </Dialog>
  );
};

const SoftCreateDevice = ({ open, setOpen, network }) => {
  const selectedNetwork = JSON.parse(localStorage.getItem('activeNetwork')).net_name;
  const classes = useStyles();
  const dispatch = useDispatch();
  const newDeviceInitState = {
    long_name: '',
    category: CATEGORIES[0].value,
    network: selectedNetwork
  };

  const initialErrors = {
    long_name: '',
    category: '',
    network: ''
  };

  const [newDevice, setNewDevice] = useState(newDeviceInitState);
  const [errors, setErrors] = useState(initialErrors);
  const userNetworks = JSON.parse(localStorage.getItem('userNetworks')) || [];
  const loaderStatus = useSelector((state) => state.HorizontalLoader.loading);

  const handleDeviceDataChange = (key) => (event) => {
    return setNewDevice({ ...newDevice, [key]: event.target.value });
  };

  const handleDropdownChange = (event, { name }) => {
    return setNewDevice({ ...newDevice, [name]: event.value });
  };

  const handleRegisterClose = () => {
    setOpen(false);
    dispatch(loadStatus(false));
    setNewDevice({ long_name: '', category: CATEGORIES[0].value, network: selectedNetwork });
    setErrors({ long_name: '', category: '', network: '' });
  };

  const handleRegisterSubmit = async (e) => {
    try {
      dispatch(loadStatus(true));
      if (!isEmpty(userNetworks)) {
        const userNetworksNames = userNetworks.map((network) => network.net_name);

        if (!userNetworksNames.includes(newDevice.network)) {
          dispatch(
            updateMainAlert({
              message: `You are not a member of the ${newDevice.network} organisation. Only members of the org can add devices to it. Contact support if you think this is a mistake.`,
              show: true,
              severity: 'error'
            })
          );
          return;
        } else {
          const resData = await softCreateDeviceApi(dropEmpty(newDevice), {
            headers: { 'Content-Type': 'application/json' }
          });

          if (!isEmpty(selectedNetwork)) {
            dispatch(loadDevicesData(selectedNetwork));
          }

          dispatch(
            updateMainAlert({
              message: `${resData.message}. ${
                newDevice.network !== selectedNetwork
                  ? `Switch to the ${newDevice.network} organisation to see the new device.`
                  : ''
              }`,
              show: true,
              severity: 'success'
            })
          );

          dispatch(setRefresh(true));
          handleRegisterClose();
        }
      }
    } catch (error) {
      const errors = error.response && error.response.data && error.response.data.errors;
      setErrors(errors || initialErrors);
      dispatch(
        updateMainAlert({
          message: error.response && error.response.data && error.response.data.message,
          show: true,
          severity: 'error',
          extra: createAlertBarExtraContentFromObject(errors || {})
        })
      );
      dispatch(loadStatus(false));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleRegisterClose}
      aria-labelledby="form-dialog-title"
      aria-describedby="form-dialog-description">
      <DialogTitle id="form-dialog-title" style={{ textTransform: 'uppercase' }}>
        Soft add a device
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <form className={classes.modelWidth}>
          <TextField
            autoFocus
            margin="dense"
            label="Device Name"
            variant="outlined"
            value={newDevice.long_name}
            onChange={handleDeviceDataChange('long_name')}
            fullWidth
            required
            error={!!errors.long_name}
            helperText={errors.long_name}
          />
          <Select
            fullWidth
            label="Category"
            name="category"
            style={{ margin: '10px 0' }}
            options={categoriesOptions}
            styles={customStyles}
            defaultValue={newDevice.category}
            placeholder="Select a category"
            onChange={handleDropdownChange}
            SelectProps={{
              native: true,
              style: { width: '100%', height: '40px' }
            }}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Network"
            value={newDevice.network}
            variant="outlined"
            error={!!errors.network}
            helperText={errors.network}
            disabled></TextField>
        </form>
      </DialogContent>

      <DialogActions>
        <Grid container alignItems="flex-end" alignContent="flex-end" justify="flex-end">
          <Button variant="contained" type="button" onClick={handleRegisterClose}>
            Cancel
          </Button>
          <Button
            disabled={loaderStatus}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleRegisterSubmit}
            style={{ margin: '0 15px' }}>
            Register
          </Button>
        </Grid>
        <br />
      </DialogActions>
    </Dialog>
  );
};

const DevicesTable = (props) => {
  const { className, users, ...rest } = props;
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const devices = useDevicesData();
  const sites = useSitesData();
  const [deviceList, setDeviceList] = useState(Object.values(devices));
  const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));
  const [delDevice, setDelDevice] = useState({ open: false, name: '' });
  const deviceColumns = createDeviceColumns(history, setDelDevice);
  const [loading, setLoading] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [softRegisterOpen, setSoftRegisterOpen] = useState(false);
  const refresh = useSelector((state) => state.HorizontalLoader.refresh);

  useEffect(() => {
    setLoading(true);
    if (isEmpty(devices)) {
      if (!isEmpty(activeNetwork)) {
        dispatch(loadDevicesData(activeNetwork.net_name));
        dispatch(loadSitesData(activeNetwork.net_name));
      }
    }
    dispatch(updateDeviceBackUrl(location.pathname));
    setDeviceList(Object.values(devices));
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    dispatch(setRefresh(false));
  }, [devices, refresh]);

  const handleDeleteDevice = async () => {
    if (delDevice.name) {
      dispatch(loadStatus(true));
      try {
        await deleteDeviceApi(delDevice.name);
        delete devices[delDevice.name];
        setDeviceList(Object.values(devices));
        dispatch(loadDevicesData(activeNetwork.net_name));
        dispatch(
          updateMainAlert({
            show: true,
            message: `device ${delDevice.name} deleted successfully`,
            severity: 'success'
          })
        );
      } catch (err) {
        let msg = `deletion of ${delDevice.name} failed`;
        if (err.response && err.response.data) {
          msg = err.response.data.message || msg;
        }
        dispatch(
          updateMainAlert({
            show: true,
            message: msg,
            severity: 'error'
          })
        );
      } finally {
        dispatch(loadStatus(false));
        dispatch(setRefresh(true));
      }
    }
    setDelDevice({ open: false, name: '' });
  };

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <br />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
          {activeNetwork.net_name === 'airqo' && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              align="right"
              onClick={() => setRegisterOpen(true)}>
              {' '}
              Add AirQo Device
            </Button>
          )}
          <Button
            variant={activeNetwork.net_name === 'airqo' ? 'outlined' : 'contained'}
            color="primary"
            type="submit"
            style={{ marginLeft: '20px' }}
            onClick={() => setSoftRegisterOpen(true)}>
            Add External Device
          </Button>
        </div>
        <UsersListBreadCrumb
          category="Device Registry"
          usersTable={`${activeNetwork.net_name === 'airqo' ? 'AirQo' : activeNetwork.net_name}`}
        />

        <CustomMaterialTable
          title={`Device Registry for ${
            activeNetwork.net_name === 'airqo' ? 'AirQo' : activeNetwork.net_name
          }`}
          userPreferencePaginationKey={'devices'}
          columns={deviceColumns}
          data={deviceList.map((x) => Object.assign({}, x))}
          isLoading={loading}
          onRowClick={(event, rowData) => {
            event.preventDefault();
            dispatch(updateDeviceDetails(rowData));
            return history.push(`/device/${rowData.name}/overview`);
          }}
          options={{
            search: true,
            exportButton: true,
            searchFieldAlignment: 'right',
            showTitle: true,
            searchFieldStyle: {
              fontFamily: 'Open Sans'
            },
            headerStyle: {
              fontFamily: 'Open Sans',
              fontSize: 16,
              fontWeight: 600
            }
          }}
        />

        <CreateDevice open={registerOpen} setOpen={setRegisterOpen} network={activeNetwork} />
        <SoftCreateDevice
          open={softRegisterOpen}
          setOpen={setSoftRegisterOpen}
          network={activeNetwork}
        />

        <ConfirmDialog
          open={delDevice.open}
          title={'Delete a device?'}
          message={`Are you sure you want to delete this ${delDevice.name} device`}
          close={() => setDelDevice({ open: false, name: '' })}
          confirm={handleDeleteDevice}
          error
        />
      </div>
    </ErrorBoundary>
  );
};

DevicesTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default withPermission(DevicesTable, 'CREATE_UPDATE_AND_DELETE_NETWORK_DEVICES');
