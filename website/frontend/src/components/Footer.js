import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import MakText from 'icons/nav/MakText';
import AirQo from 'icons/footer/AirQo';
import Twitter from 'icons/footer/Twitter';
import Facebook from 'icons/footer/Facebook';
import Youtube from 'icons/footer/Youtube';
import LinkedIn from 'icons/footer/LinkedIn.svg';
import Location from 'icons/footer/Location';
import ArrowDown from 'icons/footer/ArrowDown';
import CancelIcon from 'icons/footer/cancel.svg';

import Uganda from 'icons/africanCities/countries/uganda.svg';
import Kenya from 'icons/africanCities/countries/kenya.svg';
import Nigeria from 'icons/africanCities/countries/nigeria.svg';
import Ghana from 'icons/africanCities/countries/ghana.svg';
import Burundi from 'icons/africanCities/countries/burundi.svg';
import Senegal from 'icons/africanCities/countries/senegal.svg';
import Mozambique from 'icons/africanCities/countries/mozambique.svg';
import Cameroon from 'icons/africanCities/countries/cameroon.svg';

import { useAirqloudSummaryData, useCurrentAirqloudData } from 'reduxStore/AirQlouds/selectors';
import { setCurrentAirQloudData } from 'reduxStore/AirQlouds/operations';

import { LOCATIONS_TRACKING_URL } from '../../config/urls';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  // minHeight: 200,
  width: '90%',
  bgcolor: 'background.paper',
  outline: 'none'
  // boxShadow: 24,
  // p: 4,
};

const flagMapper = {
  uganda: <Uganda />,
  kenya: <Kenya />,
  nigeria: <Nigeria />,
  ghana: <Ghana />,
  burundi: <Burundi />,
  senegal: <Senegal />,
  mozambique: <Mozambique />,
  cameroon: <Cameroon />
};

const CountryTab = ({ className, flag, name, onClick }) => (
  <div className={className} onClick={onClick}>
    {flag} <span>{name}</span>
  </div>
);

const Footer = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const airqloudSummaries = useAirqloudSummaryData();
  const currentAirqloud = useCurrentAirqloudData();
  const [selectedAirqloud, setSelectedAirqloud] = useState(currentAirqloud);

  const currentAirqloudData = airqloudSummaries[currentAirqloud] || { numberOfSites: 0 };

  const explodeSummaryCount = (numberOfSites) => {
    const paddedCount = numberOfSites.toString().padStart(4, '0');
    return paddedCount.split('');
  };

  const toggleOpen = () => setOpen(!open);

  const active = (country) => (country === selectedCountry ? 'tab-selected' : '');

  const onTabClick = (country) => () => {
    setSelectedCountry(country);
    setSelectedAirqloud(country);
  };

  const onCancel = () => {
    setSelectedCountry(currentAirqloud);
    setOpen(false);
  };

  const onSave = () => {
    dispatch(setCurrentAirQloudData(selectedCountry));
    setOpen(false);
  };

  useEffect(() => {
    setSelectedCountry(currentAirqloud);
  }, [currentAirqloud]);

  useEffect(() => {
    const getUserCountryFromStorage = () => {
      const storedCountry = localStorage.getItem('userCountry');
      if (storedCountry) {
        dispatch(setCurrentAirQloudData(storedCountry));
      } else {
        getUserGeolocation();
      }
    };

    // Function to fetch users country based on their IP address
    const getUserCountry = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          LOCATIONS_TRACKING_URL +
            `?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const { countryName } = response.data;
        if (countries.some((country) => countryName === country.name)) {
          dispatch(setCurrentAirQloudData(countryName));
          localStorage.setItem('userCountry', countryName);
        } else {
          dispatch(setCurrentAirQloudData('Uganda'));
          localStorage.setItem('userCountry', 'Uganda');
        }
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    // Function to get user's geolocation if available
    const getUserGeolocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const storedLatitude = parseFloat(localStorage.getItem('latitude'));
            const storedLongitude = parseFloat(localStorage.getItem('longitude'));
            if (
              !storedLatitude ||
              !storedLongitude ||
              distance(storedLatitude, storedLongitude, latitude, longitude) > 100
            ) {
              try {
                await getUserCountry(latitude, longitude);
                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);
              } catch (error) {
                console.error('Error fetching user country from geolocation:', error);
                getUserCountryFromStorage();
              }
            } else {
              getUserCountryFromStorage();
            }
          },
          (error) => {
            console.error('Error getting user geolocation:', error);
            getUserCountryFromStorage();
          }
        );
      } else {
        getUserCountryFromStorage();
      }
    };

    getUserCountryFromStorage();
  }, []);

  // Function to calculate distance between two sets of latitude and longitude
  const distance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;
    const a =
      0.5 -
      Math.cos((lat2 - lat1) * p) / 2 +
      (Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p))) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
  };

  // an array for the countries
  const countries = [
    { name: 'Uganda', flag: <Uganda /> },
    { name: 'Kenya', flag: <Kenya /> },
    { name: 'Nigeria', flag: <Nigeria /> },
    { name: 'Ghana', flag: <Ghana /> },
    { name: 'Burundi', flag: <Burundi /> },
    { name: 'Senegal', flag: <Senegal /> },
    { name: 'Mozambique', flag: <Mozambique /> },
    { name: 'Cameroon', flag: <Cameroon /> }
  ];

  return (
    <footer className="footer-wrapper">
      <div className="Footer">
        <div className="body-section">
          <div className="logo">
            <AirQo />
            <div className="logo-text">
              Clean air for all <br /> African Cities!
            </div>
            <div className="social-links">
              <a target="_blank" href="https://www.facebook.com/AirQo" rel="noreferrer">
                <Facebook />
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/channel/UCx7YtV55TcqKGeKsDdT5_XQ"
                rel="noreferrer">
                <Youtube />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/company/airqo/mycompany/"
                rel="noreferrer">
                <LinkedIn />
              </a>
              <a target="_blank" href="https://twitter.com/AirQoProject" rel="noreferrer">
                <Twitter />
              </a>
            </div>
          </div>
          <div className="content">
            <span className="content-tabs middle-tab">
              <span>Products</span>
              <div>
                <span>
                  <Link to="/products/monitor">Air quality Monitor</Link>
                </span>
                <span>
                  <Link to="/products/analytics">Air quality Dashboard</Link>
                </span>
                <span>
                  <Link to="/products/api">Air quality API</Link>
                </span>
                <span>
                  <Link to="/products/mobile-app">AirQo Mobile App</Link>
                </span>
              </div>
            </span>
            <span className="content-tabs middle-tab">
              <span>Solutions</span>
              <div>
                <span>
                  <Link to="/solutions/african-cities">For African cities</Link>
                </span>
                <span>
                  <Link to="/solutions/communities">For Communities</Link>
                </span>
                <span>
                  <Link to="/solutions/research">For Research</Link>
                </span>
              </div>
            </span>
            <span className="content-tabs">
              <span>About</span>
              <div>
                <span>
                  <Link to="/about-us">About</Link>
                </span>
                <span>
                  <Link to="/careers">Careers</Link>
                </span>
                <span>
                  <Link to="/publications">Publications</Link>
                </span>
                <span>
                  <Link to="/events">Events</Link>
                </span>
                <span>
                  <Link to="/press">Press</Link>
                </span>
                <span>
                  <Link to="/contact">Contact</Link>
                </span>
                <span>
                  <a target="_blank" href="https://medium.com/@airqo" rel="noreferrer noopener">
                    Blog
                  </a>
                </span>
              </div>
            </span>
          </div>
          <div className="airqlouds-summary" onClick={toggleOpen}>
            <div className="airqloud-dropdown">
              <Location />
              <span>{currentAirqloud}</span>
              <ArrowDown />
            </div>
            <div className="airqloud-count">
              <span className="count-value">
                {explodeSummaryCount(currentAirqloudData.numberOfSites).map((value, key) => (
                  <span key={key}>{value}</span>
                ))}
              </span>{' '}
              <span className="count-text">Monitors in {currentAirqloud}</span>
            </div>
          </div>
        </div>
        <div className="copyright-section">
          <div className="copyright-container">
            <div className="text-copyright">© {new Date().getFullYear()} AirQo</div>
            <div className="terms-section">
              <span className="text-terms mr-24">
                <Link to="/legal">Terms of Service</Link>
              </span>
              <span className="text-terms mr-24">
                <Link to="/legal">Privacy Policy</Link>
              </span>
              {/* <span className="text-terms mr-24">Sustainability</span> */}
            </div>
          </div>
          <div className="project-container mb-24">
            <div className="project">
              <div className="project-text">A project by</div>
              <MakText />
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={toggleOpen}>
        <Box sx={style}>
          <div className="modal">
            <div className="modal-title">
              <span>Country AirQloud</span>
              <CancelIcon className="modal-cancel" onClick={toggleOpen} />
            </div>
            <div className="divider" />
            <div className="title">Our growing network in Africa</div>
            <div className="sub-title">View AirQo developments in your country</div>
            <div className="category-label">Selected country</div>
            <CountryTab
              className="tab tab-selected tab-margin"
              flag={flagMapper[selectedAirqloud.toLowerCase()]}
              name={selectedAirqloud}
            />
            <div className="category-label">Select country</div>
            <div className="countries">
              {/* The country list displayed here */}
              {countries.map((country) => (
                <CountryTab
                  className={`tab tab-margin-sm ${active(country.name)}`}
                  flag={country.flag}
                  name={country.name}
                  onClick={onTabClick(country.name)}
                />
              ))}
              <CountryTab className={`tab tab-margin-sm`} />
            </div>
            <div className="divider" />
            <div className="btns">
              <div className="cancel-btn" onClick={onCancel}>
                cancel
              </div>
              <div className="save-btn" onClick={onSave}>
                save
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </footer>
  );
};

export default Footer;
