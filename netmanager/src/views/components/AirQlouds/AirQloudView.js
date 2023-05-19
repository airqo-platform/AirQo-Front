import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBackIosRounded } from '@material-ui/icons';
import { Button, Grid, Paper, TextField, Card, CardContent,CardHeader, CardActions, Divider, CircularProgress,} from '@material-ui/core';
import CustomMaterialTable from '../Table/CustomMaterialTable';
import { useInitScrollTop } from 'utils/customHooks';
import ErrorBoundary from 'views/ErrorBoundary/ErrorBoundary';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { updateMainAlert } from 'redux/MainAlert/operations';
import { roundToStartOfDay, roundToEndOfDay } from 'utils/dateTime';
import { generateAirQloudDataSummaryApi } from 'views/apis/analytics';
import Typography from '@material-ui/core/Typography';
// redux
import { useSelectedAirqloudData } from 'redux/AirQloud/selectors';
import { getAirqloudDetails, removeAirQloudData, refreshAirQloud } from 'redux/AirQloud/operations';

// css
import 'react-leaflet-fullscreen/dist/styles.css';
import 'assets/css/location-registry.css';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4)
  },
 
}));


const gridItemStyle = {
  padding: '5px',
  margin: '5px 0'
};

const AirQloudForm = ({ airqloud }) => {
  const history = useHistory();
  const dispatch = useDispatch();


  return (
    <Paper
      style={{
        margin: '0 auto',
        minHeight: '400px',
        padding: '20px 20px',
        maxWidth: '1500px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color="primary"
          onClick={() => dispatch(refreshAirQloud(airqloud.long_name, airqloud._id))}
        >
          Refresh AirQloud
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          margin: '20px 0'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px'
          }}
        >
          <ArrowBackIosRounded
            style={{ color: '#3f51b5', cursor: 'pointer' }}
            onClick={() => {
              history.push('/airqlouds');
              dispatch(removeAirQloudData());
            }}
          />
        </div>
        AirQloud Details
      </div>
      <Grid container spacing={1}>
        <Grid items xs={12} sm={6} style={gridItemStyle}>
          <TextField
            id="name"
            label="name"
            variant="outlined"
            value={airqloud.long_name}
            fullWidth
            required
          />
        </Grid>
        <Grid items xs={12} sm={6} style={gridItemStyle}>
          <TextField
            id="name"
            label="AirQloud ID"
            value={airqloud.name}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid items xs={12} sm={6} style={gridItemStyle}>
          <TextField
            id="admin_level"
            label="Administrative Level"
            value={airqloud.admin_level}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid items xs={12} sm={6} style={gridItemStyle}>
          <TextField
            id="isCustom"
            label="Is Custom"
            variant="outlined"
            value={(airqloud.isCustom && 'Yes') || 'No'}
            fullWidth
          />
        </Grid>
        <Grid items xs={12} sm={6} style={gridItemStyle}>
          <TextField
            id="siteCount"
            label="Site Count"
            variant="outlined"
            value={(airqloud.sites && airqloud.sites.length) || 0}
            fullWidth
          />
        </Grid>
        {/*<Grid*/}
        {/*  container*/}
        {/*  alignItems="flex-end"*/}
        {/*  alignContent="flex-end"*/}
        {/*  justify="flex-end"*/}
        {/*  xs={12}*/}
        {/*  style={{ margin: "10px 0" }}*/}
        {/*>*/}
        {/*  <Button variant="contained" onClick={handleCancel}>*/}
        {/*    Cancel*/}
        {/*  </Button>*/}

        {/*  <Button*/}
        {/*    variant="contained"*/}
        {/*    color="primary"*/}
        {/*    disabled={weightedBool(manualDisable, isEqual(site, siteInfo))}*/}
        {/*    onClick={handleSubmit}*/}
        {/*    style={{ marginLeft: "10px" }}*/}
        {/*  >*/}
        {/*    Save Changes*/}
        {/*  </Button>*/}
        {/*</Grid>*/}
      </Grid>
    </Paper>
  );
};

const AirQloudView = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  useInitScrollTop();
  let params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const airqloud = useSelectedAirqloudData(params.id);

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataSummaryReady, setDataSummaryReady] = useState(false);
  const [airQloudDataSummaryReport, setAirQloudDataSummaryReport] = useState(null);

  const formatDate = (date) => {
    const date_ = new Date(date);
    return date_.toISOString().split('T')[0];
  };

  const disableReportGenerationBtn = () => {
    return (
        !(
          startDate &&
          endDate       
        ) || loading
      );
    
  };

  const generateAirQloudDataReport = (e) => {
    e.preventDefault();

    setLoading(true);

    let data = {
      startDateTime: roundToStartOfDay(new Date(startDate).toISOString()),
      endDateTime: roundToEndOfDay(new Date(endDate).toISOString()),
      airqloud: params.id
    };

    generateAirQloudDataReportFunc(data);
  };

  const generateAirQloudDataReportFunc = async (body) => {
    await generateAirQloudDataSummaryApi(body)
      .then((response) => response.data)
      .then((resData) => {
        
       //TODO: Populate the charts and reports to be displayed.
        setAirQloudDataSummaryReport(resData);
        setLoading(false);
        setStartDate(null);
        setEndDate(null);  
        setDataSummaryReady(true)     
        dispatch(
          updateMainAlert({
            message: 'AirQloud Data Summary Report Generated ',
            show: true,
            severity: 'success'
          })
        );
      })
      .catch((err) => {
        if (err.response.data.status === 'success') {
          dispatch(
            updateMainAlert({
              message: 'Uh-oh! No data summary report generated for the selected time period. no data',
              show: true,
              severity: 'success'
            })
          );
        } else {
          dispatch(
            updateMainAlert({
              message: err.response.data.message,
              show: true,
              severity: 'error'
            })
          );
        }

        setLoading(false);
        setStartDate(null);
        setEndDate(null);
      });
  };


  useEffect(() => {
    dispatch(getAirqloudDetails(params.id));
  }, []);

  return (
    <div
      style={{
        width: '96%',
        margin: ' 20px auto'
      }}
    >
      <AirQloudForm airqloud={airqloud} key={`${airqloud._id}`} />

      <div>
        <div
          style={{
            margin: '50px auto',
            // minHeight: "400px",
            maxWidth: '1500px'
          }}
        >
          <CustomMaterialTable
            title="AirQloud Sites details"
            userPreferencePaginationKey={'siteDevices'}
            columns={[
              {
                title: 'Site Name',
                field: 'name'
              },
              {
                title: 'Site ID',
                field: 'generated_name'
              },
              {
                title: 'District',
                field: 'district'
              },
              {
                title: 'Region',
                field: 'region'
              },
              {
                title: 'Country',
                field: 'country'
              }
            ]}
            data={airqloud.sites || []}
            onRowClick={(event, rowData) => {
              event.preventDefault();
              return history.push(`/sites/${rowData._id}/`);
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
                fontSize: 14,
                fontWeight: 600
              }
            }}
          />
        </div>
      </div>
      
      <div style={{
            margin: '50px auto',
            // minHeight: "400px",
            maxWidth: '1500px'
          }}>
      <ErrorBoundary>
      <div className={classes.rootxx}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card
              {...rest}
              className={clsx(classes.root, className)}
              style={{ overflow: 'visible' }}
            >
              {/*<CardHeader
                subheader="Generate Data Summary For the AirQloud"
                title= {airqloud.name} 
                //"Calibrated Data Availability For the AirQloud"
        /> */}
           
              <form onSubmit={generateAirQloudDataReport}>
                  <CardContent>
                    <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                     
                     <h4>Generate Data Summary For {airqloud.name} For the Selected Time Period</h4>
              
                     </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          label="Start Date"
                          className="reactSelect"
                          fullWidth
                          variant="outlined"
                          value={startDate}
                          InputLabelProps={{ shrink: true }}
                          type="date"
                          onChange={(event) => setStartDate(event.target.value)}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <TextField
                          label="End Date"
                          className="reactSelect"
                          fullWidth
                          variant="outlined"
                          value={endDate}
                          InputLabelProps={{ shrink: true }}
                          type="date"
                          onChange={(event) => setEndDate(event.target.value)}
                        />
                      </Grid>

                    </Grid>
                  </CardContent>

                  <Divider />
                  <CardActions>
                    <span style={{ position: 'relative' }}>
                      <Button
                        color="primary"
                        variant="outlined"
                        type="submit"
                        disabled={disableReportGenerationBtn()}
                      >
                        {' '}
                        Generate Data Summary Report
                      </Button>
                      {loading && (
                        <CircularProgress
                          size={24}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px'
                          }}
                        />
                      )}
                    </span>
                  </CardActions>
                </form>
            </Card>
          </Grid>
        </Grid>
      </div>
    </ErrorBoundary>
      </div>

      <div style={{
            margin: '50px auto',
            // minHeight: "400px",
            maxWidth: '1500px'
          }}>

{dataSummaryReady && (<div className={classes.rootxx}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card
              {...rest}
              className={clsx(classes.root, className)}
              style={{ overflow: 'visible' }}
            >
              {/*<CardHeader
                //subheader="Data Summary For the AirQloud"
                //title= {airqloud.name} 
              >  
               
</CardHeader> */}
           
                <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                     
                      <h4>Data Summary For {airQloudDataSummaryReport.airqloud} From {formatDate(airQloudDataSummaryReport.start_date_time, 'YYYY-MM-DD')} to {formatDate(airQloudDataSummaryReport.end_date_time,'YYYY-MM-DD')}</h4>
               
                      </Grid>
                      <Grid item md={12} xs={12} container spacing={4}>
                        <Grid  item lg={2} sm={6} xl={2} xs={12}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                          >
                            Hourly Records
                          </Typography>
                          <Typography variant="h3">{airQloudDataSummaryReport.hourly_records}</Typography> 
                        </Grid>

                        <Grid  item lg={2} sm={6} xl={2} xs={12}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                          >
                            Calibrated Records:
                          </Typography>
                          <Typography variant="h3">{airQloudDataSummaryReport.calibrated_records}</Typography> 
                        </Grid>
                      
                        <Grid  item lg={2} sm={6} xl={2} xs={12}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                          >
                            Uncalibrated Records
                          </Typography>
                          <Typography variant="h3">{airQloudDataSummaryReport.uncalibrated_records}</Typography> 
                        </Grid>
                        
                        <Grid  item lg={2} sm={6} xl={2} xs={12}>
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                          >
                            Calibrated Records(%)
                          </Typography>
                          <Typography variant="h3">{airQloudDataSummaryReport.calibrated_percentage.toFixed(2)}</Typography> 
                        </Grid>

                        <Grid  item lg={2} sm={6} xl={2} xs={12}>
                        
                        <Typography className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                          >
                           Un Calibrated Records (%)
                          </Typography>
                          <Typography variant="h3">{airQloudDataSummaryReport.uncalibrated_percentage.toFixed(2)}</Typography> 
                        </Grid>
                      
    
                      </Grid>

                      <Grid item md={12} xs={12}>
                      <CustomMaterialTable
                          title="AirQloud Sites Data Summary "
                           userPreferencePaginationKey={'siteDevices'}
                            columns={[
                              {
                                title: 'Site Name',
                                field: 'site_name'
                              },
                              {
                                title: 'Hourly Data (Records Count)',
                                field: 'hourly_records'
                              },
                              {
                                title: 'Calibrated Data (Records Count)',
                                field: 'calibrated_records'
                              },
                              {
                                title: 'Un Calibrated Data (Records Count)',
                                field: 'uncalibrated_records'
                              },
                              {
                                title: 'Calibrated Data (%)',
                                field: 'calibrated_percentage'
                              },
                              {
                                title: 'UnCalibrated Data (%)',
                                field: 'uncalibrated_percentage'
                              }
                            ]}
            data={airQloudDataSummaryReport.sites || []}
            /*onRowClick={(event, rowData) => {
              event.preventDefault();
              return history.push(`/sites/${rowData._id}/`);
            }}*/
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
                fontSize: 14,
                fontWeight: 600
              }
            }}
          />
                      </Grid>

                      <Grid item md={12} xs={12}>
                      <CustomMaterialTable
                          title="AirQloud Devices Data Summary "
                           userPreferencePaginationKey={'airqloudDevices'}
                            columns={[
                              {
                                title: 'Device',
                                field: 'device'
                              },
                              {
                                title: 'Hourly Data (Records Count)',
                                field: 'hourly_records'
                              },
                              {
                                title: 'Calibrated Data (Records Count)',
                                field: 'calibrated_records'
                              },
                              {
                                title: 'Un Calibrated Data (Records Count)',
                                field: 'uncalibrated_records'
                              },
                              {
                                title: 'Calibrated Data (%)',
                                field: 'calibrated_percentage'
                              },
                              {
                                title: 'UnCalibrated Data (%)',
                                field: 'uncalibrated_percentage'
                              }
                            ]}
            data={airQloudDataSummaryReport.devices || []}
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
                fontSize: 14,
                fontWeight: 600
              }
            }}
          />
                      </Grid>

                    </Grid>
                  </CardContent>
              
            </Card>
          </Grid>
        </Grid>
      </div>)}
            

      </div>
    </div>
  );
};

AirQloudView.propTypes = {
  className: PropTypes.string
};

export default AirQloudView;
