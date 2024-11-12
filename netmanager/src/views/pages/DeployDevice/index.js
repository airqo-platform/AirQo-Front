import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Checkbox,
  FormControlLabel,
  Snackbar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import OutlinedSelect from '../../components/CustomSelects/OutlinedSelect';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { batchDeployDevicesApi } from '../../apis/deviceRegistry';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { DeviceHub, Power, Height, LocationOn, Home } from '@material-ui/icons';
import { withPermission } from '../../containers/PageAccess';
import theme from '../../../theme';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import { useDispatch } from 'react-redux';
import { updateMainAlert } from '../../../redux/MainAlert/operations';
import { debounce } from 'lodash';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Dialog from '@material-ui/core/Dialog';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      paddingLeft: 64,
      paddingRight: 64
    }
  },
  card: {
    marginTop: theme.spacing(3)
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3)
  },
  button: {
    width: 180,
    marginLeft: theme.spacing(1)
  },
  cardContent: {
    padding: theme.spacing(4)
  },
  formControl: {
    marginBottom: theme.spacing(2)
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column',
      gap: theme.spacing(1)
    }
  },
  label: {
    minWidth: 120,
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      minWidth: 'auto',
      marginRight: 0,
      marginBottom: theme.spacing(0.5)
    }
  },
  siteDetailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      gap: theme.spacing(4)
    }
  },
  siteDetailsFields: {
    flex: 1,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      flex: '0 0 350px',
      marginBottom: 0,
      marginRight: 20
    }
  },
  mapContainer: {
    height: 250,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      flex: 1,
      height: 400
    },
    overflow: 'hidden',
    position: 'relative'
  },
  mapPreviewPlaceholder: {
    height: 250,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: theme.shape.borderRadius
  },
  infoCard: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  alert: {
    width: '100%'
  },
  map: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  previewPaper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  previewTitle: {
    marginBottom: theme.spacing(2)
  },
  previewSection: {
    marginBottom: theme.spacing(2)
  },
  previewList: {
    backgroundColor: theme.palette.background.paper
  },
  previewIcon: {
    color: theme.palette.primary.main
  },
  tipContainer: {
    backgroundColor: theme.palette.primary.main + '10', // Light version of primary color
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  tipText: {
    fontSize: '1rem',
    color: theme.palette.text.primary,
    fontWeight: 500
  },
  searchContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: '300px',
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2]
  },
  fullscreenSearchContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: '300px',
    zIndex: 1400, // Higher z-index for dialog
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2]
  },
  searchInput: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white'
    }
  },
  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    maxHeight: 200,
    overflowY: 'auto',
    zIndex: 1000
  },
  searchResultItem: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    textAlign: 'left'
  },
  fullscreenButton: {
    position: 'absolute',
    left: theme.spacing(1),
    zIndex: 999,
    backgroundColor: 'white',
    padding: '6px',
    border: '2px solid rgba(0,0,0,0.2)',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#f4f4f4'
    },
    top: '95px',
    '& .MuiSvgIcon-root': {
      fontSize: '20px'
    }
  },
  fullscreenMap: {
    width: '100%',
    height: '100vh'
  },
  fullscreenDialog: {
    '& .MuiDialog-paper': {
      margin: 0,
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      position: 'relative' // Ensure proper positioning of children
    },
    '& .leaflet-control-zoom': {
      marginTop: '40px'
    }
  }
}));

const steps = ['Device Details', 'Site Details', 'Deploy'];

const DEFAULT_CENTER = [0.3476, 32.5825]; // Default center (Uganda)

const DeployDevice = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [powerType, setPowerType] = useState('');
  const [mountType, setMountType] = useState('');
  const [height, setHeight] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [siteName, setSiteName] = useState('');
  const [isPrimaryDevice, setIsPrimaryDevice] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const mapRef = useRef();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [latitudeError, setLatitudeError] = useState('');
  const [longitudeError, setLongitudeError] = useState('');
  const [siteNameError, setSiteNameError] = useState('');
  const [deviceNameError, setDeviceNameError] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const markerRef = useRef(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [map, setMap] = useState(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const powerTypeOptions = [
    { value: 'solar', label: 'Solar' },
    { value: 'mains', label: 'Mains' },
    { value: 'alternator', label: 'Alternator' }
  ];

  const mountTypeOptions = [
    { value: 'faceboard', label: 'Faceboard' },
    { value: 'pole', label: 'Pole' },
    { value: 'rooftop', label: 'Rooftop' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'wall', label: 'Wall' }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    const deployData = [
      {
        date: new Date().toISOString(),
        height: parseFloat(height),
        mountType: mountType.value,
        powerType: powerType.value,
        isPrimaryInLocation: isPrimaryDevice,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        site_name: siteName,
        network: 'airqo',
        deviceName: deviceName
      }
    ];

    try {
      const response = await batchDeployDevicesApi(deployData);

      if (response.success) {
        if (
          response.successful_deployments.length > 0 &&
          response.failed_deployments.length === 0
        ) {
          setAlertSeverity('success');
          setAlertMessage('Device deployed successfully!');

          // Reset form values
          setDeviceName('');
          setPowerType('');
          setMountType('');
          setHeight('');
          setLatitude('');
          setLongitude('');
          setSiteName('');
          setIsPrimaryDevice(false);

          // Reset to first step
          setActiveStep(0);
        } else if (response.failed_deployments.length > 0) {
          setAlertSeverity('error');
          const errorMessage = response.failed_deployments[0].error.message;
          setAlertMessage(`Deployment failed: ${errorMessage}`);
        } else {
          setAlertSeverity('warning');
          setAlertMessage('No deployments were processed. Please try again.');
        }
      } else {
        setAlertSeverity('error');
        setAlertMessage('Deployment failed. Please try again.');
      }
      setOpenAlert(true);
    } catch (error) {
      console.error('Deployment failed:', error);
      setAlertSeverity('error');
      setAlertMessage('An error occurred during deployment. Please try again.');
      setOpenAlert(true);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const isStep0Valid =
    powerType && mountType && height && height > 0 && deviceName && !deviceNameError;
  const isStep1Valid =
    latitude && longitude && siteName && !latitudeError && !longitudeError && !siteNameError;

  const validateCoordinate = (value, setter) => {
    if (value === '') {
      setter('');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setter('Must be a valid number');
    } else if (!value.includes('.') || value.split('.')[1]?.length < 5) {
      setter('Must have at least 5 decimal places');
    } else {
      setter('');
    }
  };

  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    setLatitude(value);
    validateCoordinate(value, setLatitudeError);
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    setLongitude(value);
    validateCoordinate(value, setLongitudeError);
  };

  const validateSiteName = (value) => {
    if (value.length <= 3) {
      setSiteNameError('Site name must be longer than 3 characters');
    } else {
      setSiteNameError('');
    }
  };

  const handleSiteNameChange = (e) => {
    const value = e.target.value;
    setSiteName(value);
    validateSiteName(value);
  };

  const validateDeviceName = (value) => {
    if (value.length < 4) {
      setDeviceNameError('Device name must be at least 4 characters long');
    } else {
      setDeviceNameError('');
    }
  };

  const handleDeviceNameChange = (e) => {
    const value = e.target.value;
    setDeviceName(value);
    validateDeviceName(value);
  };

  const handleMarkerDrag = useCallback(() => {
    try {
      const marker = markerRef.current;
      if (!marker) return;

      const position = marker.getLatLng();
      if (!position || !position.lat || !position.lng) {
        throw new Error('Invalid marker position');
      }

      const lat = position.lat.toFixed(6);
      const lng = position.lng.toFixed(6);

      if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
        throw new Error('Invalid coordinates from marker');
      }

      setLatitude(lat);
      setLongitude(lng);
      validateCoordinate(lat, setLatitudeError);
      validateCoordinate(lng, setLongitudeError);
    } catch (error) {
      console.error('Error during marker drag:', error);
      dispatch(
        updateMainAlert({
          message: 'Error updating coordinates. Please try again.',
          show: true,
          severity: 'error'
        })
      );
    }
  }, []);

  const fetchAddress = useCallback(
    async (lat, lng) => {
      setIsReverseGeocoding(true);
      setSiteName('');
      setSiteNameError('');

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.display_name) {
          const siteName =
            data.display_name.split(',')[0] + ', ' + data.display_name.split(',')[1] ||
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.residential ||
            data.address?.road ||
            data.address?.village ||
            data.address?.town ||
            data.address?.city ||
            'Unknown Location';

          setSiteName(siteName);
          validateSiteName(siteName);
        } else {
          setSiteName('Unknown Location');
          setSiteNameError('Could not determine location name. Please enter manually.');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setSiteName('');
        setSiteNameError('Failed to fetch location name. Please enter manually.');
        dispatch(
          updateMainAlert({
            message: 'Error fetching location name. You can enter it manually.',
            show: true,
            severity: 'warning'
          })
        );
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [dispatch]
  );

  const handleMarkerDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker) {
      const position = marker.getLatLng();
      fetchAddress(position.lat, position.lng);
    }
  }, [fetchAddress]);

  const handleMapClick = useCallback(
    (e) => {
      try {
        if (!e.latlng || !e.latlng.lat || !e.latlng.lng) {
          throw new Error('Invalid click location');
        }

        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
          throw new Error('Invalid coordinates from map click');
        }

        setLatitude(lat);
        setLongitude(lng);
        validateCoordinate(lat, setLatitudeError);
        validateCoordinate(lng, setLongitudeError);
        fetchAddress(lat, lng);
      } catch (error) {
        console.error('Error handling map click:', error);
        dispatch(
          updateMainAlert({
            message: 'Error selecting location. Please try again.',
            show: true,
            severity: 'error'
          })
        );
      }
    },
    [fetchAddress]
  );

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim() || query.length < 3) return;

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setSearchResults(data);
          if (data.length === 0) {
            dispatch(
              updateMainAlert({
                message: 'No locations found for your search.',
                show: true,
                severity: 'info'
              })
            );
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error searching location:', error);
        setSearchResults([]);
        dispatch(
          updateMainAlert({
            message: 'Error searching location. Please try again or enter coordinates manually.',
            show: true,
            severity: 'error'
          })
        );
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [dispatch]
  );

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length >= 3) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  const formatSearchResult = (result) => {
    const displayNameParts = result.display_name.split(', ');

    return {
      main: displayNameParts[0],
      sub: displayNameParts.slice(1).join(', ')
    };
  };

  const handleLocationSelect = (location) => {
    try {
      if (!location || !location.lat || !location.lon) {
        throw new Error('Invalid location data');
      }

      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lon);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates');
      }

      const formattedLat = lat.toFixed(6);
      const formattedLng = lng.toFixed(6);

      setLatitude(formattedLat);
      setLongitude(formattedLng);
      validateCoordinate(formattedLat, setLatitudeError);
      validateCoordinate(formattedLng, setLongitudeError);

      if (map) {
        map.setView([lat, lng], 15);
      }

      fetchAddress(lat, lng);

      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error selecting location:', error);
      dispatch(
        updateMainAlert({
          message: 'Error selecting location. Please try again or enter coordinates manually.',
          show: true,
          severity: 'error'
        })
      );
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <div className={classes.labelContainer}>
                  <Typography variant="subtitle1" className={classes.label}>
                    Device Name *
                  </Typography>
                  <TextField
                    fullWidth
                    // label="Device Name"
                    variant="outlined"
                    value={deviceName}
                    onChange={handleDeviceNameChange}
                    error={!!deviceNameError}
                    helperText={deviceNameError}
                  />
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className={classes.labelContainer}>
                  <Typography variant="subtitle1" className={classes.label}>
                    Power Type *
                  </Typography>
                  <OutlinedSelect
                    // label="Power Type"
                    options={powerTypeOptions}
                    value={powerType}
                    onChange={(selectedOption) => setPowerType(selectedOption)}
                    placeholder="Select Power Type"
                  />
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className={classes.labelContainer}>
                  <Typography variant="subtitle1" className={classes.label}>
                    Mount Type *
                  </Typography>
                  <OutlinedSelect
                    // label="Mount Type"
                    options={mountTypeOptions}
                    value={mountType}
                    onChange={(selectedOption) => setMountType(selectedOption)}
                    placeholder="Select Mount Type"
                  />
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className={classes.labelContainer}>
                  <Typography variant="subtitle1" className={classes.label}>
                    Height *
                  </Typography>
                  <TextField
                    fullWidth
                    label="Height (meters)"
                    variant="outlined"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    helperText={height && height <= 0 ? 'Height must be greater than 0' : ''}
                  />
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className={classes.infoCard}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isPrimaryDevice}
                        onChange={(e) => setIsPrimaryDevice(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Set as primary device of location"
                  />
                </div>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <div className={classes.siteDetailsContainer}>
            <div className={classes.siteDetailsFields}>
              <div className={classes.tipContainer}>
                <LocationOn color="primary" />
                <Typography variant="body1" className={classes.tipText}>
                  Tip: Click anywhere on the map or drag the marker to update coordinates and site
                  name
                </Typography>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div className={classes.labelContainer}>
                    <Typography variant="subtitle1" className={classes.label}>
                      Latitude *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      // label="Latitude"
                      variant="outlined"
                      value={latitude}
                      onChange={handleLatitudeChange}
                      error={!!latitudeError}
                      helperText={
                        latitudeError ||
                        (latitude && (parseFloat(latitude) < -90 || parseFloat(latitude) > 90)
                          ? 'Latitude must be between -90 and 90'
                          : '')
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.labelContainer}>
                    <Typography variant="subtitle1" className={classes.label}>
                      Longitude *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      // label="Longitude"
                      variant="outlined"
                      value={longitude}
                      onChange={handleLongitudeChange}
                      error={!!longitudeError}
                      helperText={
                        longitudeError ||
                        (longitude && (parseFloat(longitude) < -180 || parseFloat(longitude) > 180)
                          ? 'Longitude must be between -180 and 180'
                          : '')
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.labelContainer}>
                    <Typography variant="subtitle1" className={classes.label}>
                      Site Name *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={siteName}
                      onChange={handleSiteNameChange}
                      error={!!siteNameError}
                      helperText={siteNameError}
                      disabled={isReverseGeocoding}
                      placeholder={
                        isReverseGeocoding ? 'Getting location name...' : 'Enter site name'
                      }
                      InputProps={{
                        endAdornment: isReverseGeocoding && (
                          <CircularProgress size={20} color="inherit" />
                        )
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className={classes.mapContainer}>
              <div className={classes.searchContainer}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search location..."
                  className={classes.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {isSearching ? (
                          <CircularProgress size={20} />
                        ) : searchQuery ? (
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    )
                  }}
                />
                {searchResults.length > 0 && (
                  <div className={classes.searchResults}>
                    {searchResults.length > 0
                      ? searchResults.map((result, index) => {
                          const formattedResult = formatSearchResult(result);
                          return (
                            <div
                              key={index}
                              className={classes.searchResultItem}
                              onClick={() => handleLocationSelect(result)}
                              role="button"
                              tabIndex={0}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleLocationSelect(result);
                              }}
                            >
                              {/* <LocationOn className={classes.locationIcon} /> */}
                              <div className={classes.resultContent}>
                                <Typography variant="body1" className={classes.resultMainText}>
                                  {formattedResult.main}
                                </Typography>
                                <Typography variant="body2" className={classes.resultSubText}>
                                  {formattedResult.sub}
                                </Typography>
                              </div>
                            </div>
                          );
                        })
                      : searchQuery.length >= 3 &&
                        !isSearching && (
                          <div className={classes.noResults}>
                            <Typography variant="body2">No locations found</Typography>
                          </div>
                        )}
                  </div>
                )}
              </div>
              <IconButton
                className={classes.fullscreenButton}
                onClick={handleFullscreenToggle}
                size="small"
                title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>

              {isFullscreen ? (
                <Dialog
                  fullScreen
                  open={isFullscreen}
                  onClose={() => setIsFullscreen(false)}
                  className={classes.fullscreenDialog}
                >
                  <div className={classes.fullscreenSearchContainer}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Search location..."
                      className={classes.searchInput}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {isSearching ? (
                              <CircularProgress size={20} />
                            ) : searchQuery ? (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSearchQuery('');
                                  setSearchResults([]);
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            ) : null}
                          </InputAdornment>
                        )
                      }}
                    />
                    {searchResults.length > 0 && (
                      <div className={classes.searchResults}>
                        {searchResults.length > 0
                          ? searchResults.map((result, index) => {
                              const formattedResult = formatSearchResult(result);
                              return (
                                <div
                                  key={index}
                                  className={classes.searchResultItem}
                                  onClick={() => handleLocationSelect(result)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleLocationSelect(result);
                                  }}
                                >
                                  {/* <LocationOn className={classes.locationIcon} /> */}
                                  <div className={classes.resultContent}>
                                    <Typography variant="body1" className={classes.resultMainText}>
                                      {formattedResult.main}
                                    </Typography>
                                    <Typography variant="body2" className={classes.resultSubText}>
                                      {formattedResult.sub}
                                    </Typography>
                                  </div>
                                </div>
                              );
                            })
                          : searchQuery.length >= 3 &&
                            !isSearching && (
                              <div className={classes.noResults}>
                                <Typography variant="body2">No locations found</Typography>
                              </div>
                            )}
                      </div>
                    )}
                  </div>

                  <IconButton
                    className={classes.fullscreenButton}
                    onClick={() => setIsFullscreen(false)}
                    size="small"
                  >
                    <FullscreenExitIcon />
                  </IconButton>

                  <LeafletMap
                    whenCreated={setMap}
                    center={latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER}
                    zoom={15}
                    scrollWheelZoom={true}
                    className={classes.fullscreenMap}
                    onClick={handleMapClick}
                  >
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                      attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
                    />
                    {latitude && longitude && (
                      <Marker
                        position={[latitude, longitude]}
                        draggable={true}
                        ref={markerRef}
                        eventHandlers={{
                          drag: handleMarkerDrag,
                          dragend: handleMarkerDragEnd
                        }}
                      >
                        <Popup>
                          <Typography variant="body2">
                            Lat: {latitude}
                            <br />
                            Lng: {longitude}
                            {isReverseGeocoding && (
                              <CircularProgress size={16} style={{ marginLeft: 8 }} />
                            )}
                          </Typography>
                        </Popup>
                      </Marker>
                    )}
                  </LeafletMap>
                </Dialog>
              ) : (
                <LeafletMap
                  whenCreated={setMap}
                  center={latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER}
                  zoom={15}
                  scrollWheelZoom={true}
                  className={classes.map}
                  onClick={handleMapClick}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
                  />
                  {latitude && longitude && (
                    <Marker
                      position={[latitude, longitude]}
                      draggable={true}
                      ref={markerRef}
                      eventHandlers={{
                        drag: handleMarkerDrag,
                        dragend: handleMarkerDragEnd
                      }}
                    >
                      <Popup>
                        <Typography variant="body2">
                          Lat: {latitude}
                          <br />
                          Lng: {longitude}
                          {isReverseGeocoding && (
                            <CircularProgress size={16} style={{ marginLeft: 8 }} />
                          )}
                        </Typography>
                      </Popup>
                    </Marker>
                  )}
                </LeafletMap>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Deployment Preview
            </Typography>
            <Paper elevation={3} className={classes.previewPaper}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Device Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {deviceName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Power Type:</strong> {powerType.label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mount Type:</strong> {mountType.label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Height:</strong> {height} meters
                  </Typography>
                  <Typography variant="body2">
                    <strong>Primary Device:</strong> {isPrimaryDevice ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Site Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Latitude:</strong> {latitude}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Longitude:</strong> {longitude}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Site Name:</strong> {siteName}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
              Please review the details above carefully. If everything looks correct, click 'Deploy'
              to proceed with the deployment.
            </Typography>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box className={classes.root}>
      <Container className={classes.container} maxWidth={false}>
        <Card className={classes.card}>
          <CardHeader title="Device Deployment" />
          <Divider />
          <CardContent className={classes.cardContent}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {renderStepContent(activeStep)}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className={classes.button}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handleDeploy : handleNext}
                className={classes.button}
                disabled={
                  (activeStep === 0 && !isStep0Valid) ||
                  (activeStep === 1 && !isStep1Valid) ||
                  isDeploying
                }
              >
                {activeStep === steps.length - 1 ? (
                  isDeploying ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Deploy'
                  )
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={openAlert}
        autoHideDuration={10000}
        onClose={handleCloseAlert}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity={alertSeverity}
          className={classes.alert}
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseAlert}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default withPermission(DeployDevice, 'DEPLOY_AIRQO_DEVICES');
