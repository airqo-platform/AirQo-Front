/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@material-ui/core';

import { Alert, AlertTitle } from '@material-ui/lab';

import { Check } from '@material-ui/icons';
import { getInitials } from 'utils/users';
import { formatDateString } from 'utils/dateTime';
import CandidateEditForm from 'views/pages/UserList/components/UserEditForm';
import CustomMaterialTable from 'views/components/Table/CustomMaterialTable';
import usersStateConnector from 'views/stateConnectors/usersStateConnector';
import ConfirmDialog from 'views/containers/ConfirmDialog';
import {
  confirmCandidateApi,
  deleteCandidateApi,
  updateCandidateApi,
  sendUserFeedbackApi
} from 'views/apis/authService';
import { updateMainAlert } from 'reducer/MainAlert/operations';
import { createAlertBarExtraContentFromObject } from 'utils/objectManipulators';
import CandidateDrawer from '../CandidateDrawer';
import { isEmpty } from 'underscore';
import InputLabel from '@material-ui/core/InputLabel';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const useStyles = makeStyles((theme) => ({
  root: {},
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
  description: {
    width: '300px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}));

const customStyles = {
  control: (base, state) => ({
    ...base,
    height: '45px',
    width: '100%',
    margin: '0 0 10px 0',
    overflow: 'scroll'
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
    marginBottom: '-10px',
    borderColor: state.isFocused ? '#3f51b5' : 'black'
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 9999
  })
};

const CandidatesTable = (props) => {
  const animatedComponents = makeAnimated();
  const { className, mappeduserState, ...rest } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [drawerCandidate, setDrawerCandidate] = useState(null);

  const [openNewMessagePopup, setOpenNewMessagePopup] = useState(false);

  const [userFeedbackMessage, setUserFeedbackMessage] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [isLoading, setLoading] = useState(false);

  const users = mappeduserState.candidates;
  const editCandidate = mappeduserState.userToEdit;
  const userToDelete = mappeduserState.userToDelete;
  const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));

  //the methods
  const hideEditDialog = () => {
    props.mappedhideEditDialog();
  };

  const submitEditCandidate = (e) => {
    e.preventDefault();
    const editForm = document.getElementById('EditCandidateForm');
    const userData = props.mappeduserState;
    if (editForm.userName.value !== '') {
      const data = new FormData();
      data.append('id', userData.userToEdit._id);
      data.append('userName', editForm.userName.value);
      data.append('firstName', editForm.firstName.value);
      data.append('lastName', editForm.lastName.value);
      data.append('email', editForm.email.value);
      //add the role in the near future.
      props.mappedEditCandidate(data);
    } else {
      return;
    }
  };

  const hideDeleteDialog = () => {
    props.mappedHideDeleteDialog();
  };

  const cofirmDeleteCandidate = () => {
    props.mappedConfirmDeleteCandidate(mappeduserState.userToDelete);
  };

  const hideConfirmDialog = () => {
    props.mappedhideConfirmDialog();
  };

  const classes = useStyles();

  useEffect(() => {
    const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));
    if (!isEmpty(activeNetwork)) {
      props.fetchCandidates(activeNetwork._id);
    }
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setShowFullDescription(!showFullDescription);
  };

  const onConfirmBtnClick = (candidate) => () => {
    setCurrentCandidate(candidate);
    setOpen(true);
  };

  const onDenyBtnClick = (candidate) => () => {
    setCurrentCandidate(candidate);
    setOpenDel(true);
  };

  const confirmCandidate = () => {
    setOpen(false);
    setShowFullDescription(false);
    setDrawerCandidate(null);
    return confirmCandidateApi(currentCandidate)
      .then((res) => {
        const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));
        if (!isEmpty(activeNetwork)) {
          props.fetchCandidates(activeNetwork._id);
        }
        dispatch(
          updateMainAlert({
            show: true,
            message: res.message,
            severity: 'success'
          })
        );
      })
      .catch((error) => {
        const errors = (error.response && error.response.data && error.response.data.errors) || {};

        dispatch(
          updateMainAlert({
            show: true,
            message: error.response && error.response.data && error.response.data.message,
            severity: 'error',
            extra: createAlertBarExtraContentFromObject(errors || {})
          })
        );
      });
  };

  const deleteCandidate = () => {
    setOpenDel(false);
    return deleteCandidateApi(currentCandidate._id)
      .then((res) => {
        const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));
        if (!isEmpty(activeNetwork)) {
          props.fetchCandidates(activeNetwork._id);
        }
        dispatch(
          updateMainAlert({
            show: true,
            message: res.message,
            severity: 'success'
          })
        );
      })
      .catch((err) => {
        dispatch(
          updateMainAlert({
            show: true,
            message: err.response.data.message,
            severity: 'error'
          })
        );
      });
  };

  const modifyCandidate = (id, data) => {
    setOpenDel(false);
    setShowFullDescription(false);
    setDrawerCandidate(null);
    return updateCandidateApi(id, data)
      .then((res) => {
        const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));
        if (!isEmpty(activeNetwork)) {
          props.fetchCandidates(activeNetwork._id);
        }
        dispatch(
          updateMainAlert({
            show: true,
            message: res.message,
            severity: 'success'
          })
        );
      })
      .catch((err) => {
        dispatch(
          updateMainAlert({
            show: true,
            message: err.response.data.message,
            severity: 'error'
          })
        );
      });
  };

  const sendUserNewMessage = async (candidate) => {
    setLoading(true);
    if (messageSubject && userFeedbackMessage) {
      const body = {
        email: candidate.email,
        subject: messageSubject,
        message: userFeedbackMessage
      };

      sendUserFeedbackApi(body)
        .then((res) => {
          dispatch(
            updateMainAlert({
              show: true,
              message: res.message,
              severity: 'success'
            })
          );
        })
        .catch((err) => {
          return dispatch(
            updateMainAlert({
              show: true,
              message: err.response.data.message,
              severity: 'error'
            })
          );
        });

      setUserFeedbackMessage('');
      setOpenNewMessagePopup(false);
      setLoading(false);
    }
  };

  const initialColumns = [
    {
      title: 'Full Name',
      render: (user) => {
        return (
          <div className={classes.nameContainer}>
            <Typography variant="body1"> {user.firstName + ' ' + user.lastName}</Typography>
          </div>
        );
      }
    },
    {
      title: 'Email',
      field: 'email'
    },
    {
      title: 'Country',
      field: 'country'
    },
    {
      title: 'Category',
      field: 'category'
    },
    {
      title: 'Description',
      field: 'description',
      render: (candidate) => {
        let description = candidate.description;

        return (
          <span>
            <Typography className={classes.description}>
              {description.length > 300 ? description.substring(0, 300) + '...' : description}
            </Typography>
            {description.length > 128 ? (
              <a
                href="#"
                onClick={() => {
                  setShowFullDescription(!showFullDescription);
                  setDrawerCandidate(candidate);
                }}>
                {!showFullDescription && 'Show More'}
              </a>
            ) : null}
          </span>
        );
      }
    },
    {
      title: 'Status',
      field: 'status',
      render: (candidate) => {
        const statusColor = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red'
        };
        return (
          <span
            style={{
              padding: '5px',
              border: `1px solid ${statusColor[candidate.status]}`,
              color: `${statusColor[candidate.status]}`,
              fontWeight: 'bold',
              borderRadius: '5px'
            }}>
            {candidate.status}
          </span>
        );
      }
    },
    {
      title: 'Organization',
      field: 'long_organization'
    },
    {
      title: 'Job Title',
      field: 'jobTitle'
    },
    {
      title: 'Submitted',
      field: 'createdAt',
      render: (candidate) => (
        <span>{candidate.createdAt ? formatDateString(candidate.createdAt) : '---'}</span>
      )
    },
    {
      title: 'Action',
      render: (candidate) => (
        <div>
          <Button
            disabled={candidate.status === 'rejected'}
            color="primary"
            onClick={onConfirmBtnClick(candidate)}>
            Confirm
          </Button>
          {candidate.status === 'rejected' ? (
            <Button
              style={{ color: '#008CBA' }}
              onClick={() => modifyCandidate(candidate._id, { status: 'pending' })}>
              Revert
            </Button>
          ) : (
            <Button
              disabled={isLoading}
              style={{ color: 'red' }}
              onClick={onDenyBtnClick(candidate)}>
              Reject
            </Button>
          )}
        </div>
      )
    },
    {
      title: 'Message',
      render: (candidate) => (
        <div>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenNewMessagePopup(true);
              setCurrentCandidate(candidate);
            }}>
            Send message
          </Button>
        </div>
      )
    }
  ];

  const initialColumnsSelected = [
    initialColumns[0],
    initialColumns[1],
    initialColumns[2],
    initialColumns[3],
    initialColumns[4],
    initialColumns[5],
    initialColumns[9]
  ];
  const [selectedColumns, setSelectedColumns] = useState(initialColumnsSelected);

  const handleColumnSelect = (selectedOptions) => {
    const selectedColumnTitles = selectedOptions.map((option) => option.value);
    const selectedColumns = initialColumns.filter((col) =>
      selectedColumnTitles.includes(col.title)
    );
    setSelectedColumns(selectedColumns);
  };

  return (
    <>
      <div>
        <InputLabel
          id="demo-mutiple-checkbox-label"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '10px'
          }}>
          Select Columns to display
        </InputLabel>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          defaultValue={selectedColumns.map((col) => ({ value: col.title, label: col.title }))}
          isMulti
          options={initialColumns.map((col) => ({ value: col.title, label: col.title }))}
          onChange={handleColumnSelect}
          name="Select Columns to display"
          styles={customStyles}
        />
      </div>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CustomMaterialTable
          title={`Candidates for ${
            activeNetwork.net_name === 'airqo' ? 'AirQo' : activeNetwork.net_name
          }`}
          isLoading={mappeduserState.isFetching}
          userPreferencePaginationKey={'candidates'}
          data={users}
          columns={selectedColumns}
          options={{
            search: true,
            searchFieldAlignment: 'right',
            showTitle: true
          }}
        />

        {/*************************** the edit dialog **********************************************/}
        <ConfirmDialog
          open={open}
          close={() => setOpen(false)}
          confirmBtnMsg={'Confirm'}
          confirm={confirmCandidate}
          title={'Confirm candidate'}
          message={'Are you sure you want to grant this user access?'}
        />
        <ConfirmDialog
          open={openDel}
          close={() => setOpenDel(false)}
          confirmBtnMsg={'Reject'}
          confirm={() => modifyCandidate(currentCandidate._id, { status: 'rejected' })}
          title={'Reject candidate'}
          message={
            'Are you sure you want to deny access to this candidate? This process can be reverted'
          }
          error
        />
        <Dialog
          open={props.mappeduserState.showEditDialog}
          onClose={hideEditDialog}
          aria-labelledby="form-dialog-title">
          <DialogTitle></DialogTitle>
          <DialogContent></DialogContent>
          <DialogContent>
            <DialogContentText>Edit the user's details</DialogContentText>

            {editCandidate && (
              <CandidateEditForm userData={editCandidate} editCandidate={submitEditCandidate} />
            )}

            {editCandidate && mappeduserState.isFetching && (
              <Alert icon={<Check fontSize="inherit" />} severity="success">
                Updating....
              </Alert>
            )}

            {editCandidate && !mappeduserState.isFetching && mappeduserState.error && (
              <Alert severity="error">
                <AlertTitle>Failed</AlertTitle>
                <strong> {mappeduserState.error} </strong>
              </Alert>
            )}

            {editCandidate && !mappeduserState.isFetching && mappeduserState.successMsg && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>{editCandidate.firstName}</strong> {mappeduserState.successMsg}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={hideEditDialog} color="primary" variant="contained">
              cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/***************************************** deleting a user ***********************************/}

        <Dialog
          open={props.mappeduserState.showDeleteDialog}
          onClose={hideDeleteDialog}
          aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>Delete Candidate</DialogContentText>

            {props.mappeduserState.userToDelete && !userToDelete.error && !userToDelete.isFetching && (
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Are you sure you want to delete this user —{' '}
                <strong>{props.mappeduserState.userToDelete.firstName}</strong>?
                <strong> {mappeduserState.error} </strong>
              </Alert>
            )}

            {mappeduserState.userToDelete && mappeduserState.error && (
              <Alert severity="error">
                <AlertTitle>Failed</AlertTitle>
                <strong> {mappeduserState.error} </strong>
              </Alert>
            )}

            {mappeduserState.userToDelete && !mappeduserState.error && mappeduserState.isFetching && (
              <Alert severity="success">
                <strong> Deleting.... </strong>
              </Alert>
            )}

            {!mappeduserState.userToDelete &&
              !mappeduserState.error &&
              !mappeduserState.isFetching && (
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Candidate <strong> {mappeduserState.successMsg}</strong>
                </Alert>
              )}
          </DialogContent>
          <DialogActions>
            {!mappeduserState.successMsg && !mappeduserState.isFetching && (
              <div>
                <Button onClick={cofirmDeleteCandidate} color="primary">
                  Yes
                </Button>
                <Button onClick={hideDeleteDialog} color="primary">
                  No
                </Button>
              </div>
            )}
            {mappeduserState.successMsg && !mappeduserState.isFetching && (
              <Button onClick={hideConfirmDialog}>Close</Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          fullWidth
          maxWidth={'sm'}
          open={openNewMessagePopup}
          onClose={() => setOpenNewMessagePopup(false)}
          aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>Message Candidate</DialogContentText>
            <div style={{ marginBottom: '16px' }}>
              <TextField
                autoFocus
                id="subject"
                onChange={(e) => setMessageSubject(e.target.value)}
                label="Subject"
                type="text"
                variant="outlined"
                fullWidth
              />
            </div>
            <div>
              <TextField
                autoFocus
                id="message"
                onChange={(e) => setUserFeedbackMessage(e.target.value)}
                label="Message Body"
                type="text"
                multiline
                rows={8}
                variant="outlined"
                fullWidth
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isLoading}
              onClick={() => setOpenNewMessagePopup(false)}
              variant="outlined">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => sendUserNewMessage(currentCandidate)}
              color="primary">
              Finish
            </Button>
          </DialogActions>
        </Dialog>

        <CandidateDrawer
          toggleDrawer={toggleDrawer('right', false)}
          drawerCandidate={drawerCandidate}
          showFullDescription={showFullDescription}
          onDenyBtnClick={onDenyBtnClick(drawerCandidate)}
          modifyCandidate={() => modifyCandidate(drawerCandidate._id, { status: 'pending' })}
          onConfirmBtnClick={() => onConfirmBtnClick(drawerCandidate)}
          isLoading={isLoading}
        />
      </Card>
    </>
  );
};

CandidatesTable.propTypes = {
  className: PropTypes.string,
  candidates: PropTypes.array.isRequired,
  fetchCandidates: PropTypes.func.isRequired
};

export default usersStateConnector(CandidatesTable);
