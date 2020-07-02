import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Map as LeafletMap, TileLayer, Popup, Marker} from 'react-leaflet';
import {Link } from 'react-router-dom';
import {Card, CardContent, CardHeader, Divider} from '@material-ui/core';
import { useEffect, useState } from 'react';
import FullscreenControl from 'react-leaflet-fullscreen';
import 'react-leaflet-fullscreen/dist/styles.css';
import L from 'leaflet';
import Filter from './Filter';
import axios from "axios";
// import moment from 'moment';
import moment from 'moment-timezone';


const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: '0',
	  margin: 0,
	  border: 0,  
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));
//const { BaseLayer, Overlay } = LayersControl;

const Map = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const [magnitude,setMagnitude ] = useState('All');
  const [contacts,setContacts ] = useState([]);

  useEffect(() => {
   fetch('http://127.0.0.1:5000/api/v1/dashboard/monitoringsites?organisation_name=KCCA&pm25_category='+magnitude)
    //fetch('http://127.0.0.1:5000/api/v1/dashboard/monitoringsites?organisation_name=KCCA')
      .then(res => res.json())
      .then((contactData) => {
        setContacts(contactData.airquality_monitoring_sites)
      })
      .catch(console.log)
  },[]);

  let getPm25CategoryColorClass = (aqi) =>{
    return aqi > 250.4  ? 'pm25Harzadous' :
      aqi > 150.4  ? 'pm25VeryUnHealthy' :
        aqi > 55.4   ? 'pm25UnHealthy' :
          aqi > 35.4   ? 'pm25UH4SG' :
            aqi > 12   ? 'pm25Moderate' :
              aqi > 0   ? 'pm25Good' :
                'pm25UnCategorised';
  }

  let getCategorytext = (aqi) =>{
    return aqi > 250.4  ? 'Harzadous' :
      aqi > 150.4  ? 'Very UnHealthy' :
        aqi > 55.4   ? 'Unhealthy' :
          aqi > 35.4   ? 'Unhealthy for sensitive groups' :
            aqi > 12   ? 'Moderate' :
              aqi > 0   ? 'Good' :
                'UnCategorised';
  }

  let fetchFilteredData = (magnitude) => {
    //this.setState({ isLoaded: false }, () => {
    fetch('http://127.0.0.1:5000/api/v1/dashboard/monitoringsites?organisation_name=KCCA&pm25_category='+magnitude)
      .then(res => res.json())
      .then((contactData) => {
        setContacts(contactData.airquality_monitoring_sites)
      });
  };


  let getDateString = (t, tz) => {
    return moment.utc(t, 'YYYY-MM-DD HH:mm').tz("Africa/Kampala").format('YYYY-MM-DD HH:mm');
}

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader        
        title="Mean PM2.5 by Location for Past 60 Minutes"
      />
      <Divider />
            
      <CardContent>
        <LeafletMap
          animate
          attributionControl
          center={[0.3341424,32.5600613]}
          doubleClickZoom
          dragging
          easeLinearity={0.35}
          scrollWheelZoom
          zoom={12}
          zoomControl        
          
        >
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />           
          {contacts.map((contact) => (
            <Marker 
              position={[contact.Latitude,contact.Longitude]}
              fill="true"
              key={contact._id} 
              clickable="true"  
              icon={
                L.divIcon({
                html:`${contact.Last_Hour_PM25_Value == 0?'':contact.Last_Hour_PM25_Value}`,
                iconSize: 35,
                className:`leaflet-marker-icon ${getPm25CategoryColorClass(contact.Last_Hour_PM25_Value)}`
                 })}
              >
              
              <Popup>
                <h3>{contact.Parish} - {contact.Division} Division</h3> 
                <span>{contact.LocationCode}</span>

                <div
                style={{
                  backgroundColor: `${getPm25CategoryColorClass(contact.Last_Hour_PM25_Value)}`
                }}
                >
                <img
              src="https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/149_check_ok-512.png"
              width="50"
              height="50"
              alt="no img"
            />
           
                <h3> AQI: {contact.Last_Hour_PM25_Value == 0?'':contact.Last_Hour_PM25_Value} - {getCategorytext(contact.Last_Hour_PM25_Value == 0?'':contact.Last_Hour_PM25_Value)}</h3> 
                
                </div>
                <span>Last Refreshed: {getDateString(contact.LastHour)} (EAT)</span>
                <Divider/>
                <Link to={`/location/${contact.Parish}`}>More Details</Link>
                
              </Popup>
            </Marker>   
          ))}    
      
          <FullscreenControl position="topright" />

          <Filter fetchFilteredData={fetchFilteredData} />

        </LeafletMap>
        
      </CardContent>
  

    </Card>

  );
};


Map.propTypes = {
  className: PropTypes.string
};

export default Map;
