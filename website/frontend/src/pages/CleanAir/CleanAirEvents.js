import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import SEO from 'utilities/seo';
import { isEmpty } from 'underscore';
import { useInitScrollTop } from 'utilities/customHooks';
import { getAllEvents } from '../../../reduxStore/Events/EventSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterSection, IntroSection } from 'components/CleanAir';
import eventImage from 'assets/img/cleanAir/events.png';
import Loadspinner from 'src/components/LoadSpinner/SectionLoader';
import { useTranslation, Trans } from 'react-i18next';
import DoneIcon from '@mui/icons-material/Done';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Slide from '@mui/material/Slide';

const days = (date_1, date_2) => {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};

const DownArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
      <path
        d="M5 8.453l5 5 5-5"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LeftArrow = ({ width, height, fill }) => {
  return (
    <svg
      fill={fill || '#000'}
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      width={width || 16}
      height={height || 16}>
      <path d="M297.2 478l20.7-21.6L108.7 256 317.9 55.6 297.2 34 65.5 256l231.7 222zM194.1 256L425.8 34l20.7 21.6L237.3 256l209.2 200.4-20.7 21.6-231.7-222z" />
    </svg>
  );
};

const RightArrow = ({ width, height, fill }) => {
  return (
    <svg
      fill={fill || '#000'}
      viewBox="0 0 512 512"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      width={width || 16}
      height={height || 16}>
      <path d="M214.78 478l-20.67-21.57L403.27 256 194.11 55.57 214.78 34l231.68 222zm103.11-222L86.22 34 65.54 55.57 274.7 256 65.54 456.43 86.22 478z" />
    </svg>
  );
};

const FilterIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={17} viewBox="0 0 16 17" fill="none">
      <path
        d="M4 8.953h8m-10-4h12m-8 8h4"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CleanAirEvents = () => {
  useInitScrollTop();

  // Hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allEventsData = useSelector((state) => state.eventsData.events);
  const navigate = useNavigate();

  // State
  const [openDate, setOpenDate] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [filter, setFilter] = useState();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hideEvents, setHideEvents] = useState(true);

  // Refs
  const dateRef = useRef();
  const filterRef = useRef();

  // Derived data
  const eventsApiData = useMemo(() => {
    const filteredEvents = allEventsData.filter((event) => event.website_category === 'cleanair');

    // If a month is selected, filter the events based on the selected month
    if (selectedMonth) {
      return filteredEvents.filter((event) => {
        const eventDate = new Date(event.start_date);
        console.log(eventDate.getMonth(), selectedMonth);
        return eventDate.getMonth() === selectedMonth;
      });
    }

    // TODO: Add filter for format to model
    // If a filter is selected, filter the events based on the selected filter
    // if (filter) {
    //   return filteredEvents.filter((event) => event.format === filter);
    // }

    return filteredEvents;
  }, [allEventsData, selectedMonth]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(eventsApiData), [eventsApiData]);
  const pastEvents = useMemo(() => getPastEvents(eventsApiData), [eventsApiData]);

  // Effects
  useEffect(() => {
    if (isEmpty(eventsApiData)) {
      dispatch(getAllEvents());
    }
  }, [eventsApiData, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenDate(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions
  function getUpcomingEvents(events) {
    return events.filter((event) => {
      if (event.end_date !== null) return days(new Date(event.end_date), new Date()) >= 1;
      return days(new Date(event.start_date), new Date()) >= -0;
    });
  }

  function getPastEvents(events) {
    return events.filter((event) => {
      if (event.end_date !== null) return days(new Date(event.end_date), new Date()) <= 0;
      return days(new Date(event.start_date), new Date()) <= -1;
    });
  }

  const routeToDetails = useCallback(
    (events) => (event) => {
      event.preventDefault();
      if (events.web_category === 'cleanair')
        navigate(`/clean-air/event-details/${events.unique_title}/`);
      else navigate(`/events/${events.unique_title}/`);
    },
    [navigate]
  );

  const handleDateSelect = (value) => {
    setSelectedDate(value);
    setSelectedMonth(value - 1);
    setOpenDate(false);
  };

  const handleFilterSelect = (value) => {
    setFilter(value);
    setOpenFilter(false);
  };

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  // Derived data
  const currentEvents = useMemo(() => getCurrentEvents(pastEvents), [pastEvents, currentPage]);
  const totalPages = Math.ceil(pastEvents.length / eventsPerPage);

  // Helper functions
  function getCurrentEvents(events) {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return events.slice(indexOfFirstEvent, indexOfLastEvent);
  }

  const dates = [
    { month: t('cleanAirSite.events.dropdowns.date.options.1'), value: 1 },
    { month: t('cleanAirSite.events.dropdowns.date.options.2'), value: 2 },
    { month: t('cleanAirSite.events.dropdowns.date.options.3'), value: 3 },
    { month: t('cleanAirSite.events.dropdowns.date.options.4'), value: 4 },
    { month: t('cleanAirSite.events.dropdowns.date.options.5'), value: 5 },
    { month: t('cleanAirSite.events.dropdowns.date.options.6'), value: 6 },
    { month: t('cleanAirSite.events.dropdowns.date.options.7'), value: 7 },
    { month: t('cleanAirSite.events.dropdowns.date.options.8'), value: 8 },
    { month: t('cleanAirSite.events.dropdowns.date.options.9'), value: 9 },
    { month: t('cleanAirSite.events.dropdowns.date.options.10'), value: 10 },
    { month: t('cleanAirSite.events.dropdowns.date.options.11'), value: 11 },
    { month: t('cleanAirSite.events.dropdowns.date.options.12'), value: 12 }
  ];

  const filterOption1 = [
    { label: t('cleanAirSite.events.dropdowns.filter.options1.1'), value: 'webinar' },
    { label: t('cleanAirSite.events.dropdowns.filter.options1.2'), value: 'workshop' },
    { label: t('cleanAirSite.events.dropdowns.filter.options1.3'), value: 'conference' },
    { label: t('cleanAirSite.events.dropdowns.filter.options1.4'), value: 'others' }
  ];

  const filterOption2 = [
    { label: t('cleanAirSite.events.dropdowns.filter.options2.1'), value: 'online' },
    { label: t('cleanAirSite.events.dropdowns.filter.options2.2'), value: 'in-person' },
    { label: t('cleanAirSite.events.dropdowns.filter.options2.3'), value: 'hybrid' },
    { label: t('cleanAirSite.events.dropdowns.filter.options2.4'), value: 'others' }
  ];

  return (
    <div className="page-wrapper">
      <SEO
        title="Events"
        siteTitle="CLEAN-Air Network"
        description="CLEAN-Air Africa Network is a network of African cities, governments, and partners committed to improving air quality and reducing carbon emissions through sustainable transport and mobility solutions."
      />

      {/* Intro section */}
      <IntroSection
        image={eventImage}
        subtext1={t('cleanAirSite.events.section1.text')}
        imagePosition={'90%'}
      />

      {/* Events */}
      <div
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#EDF3FF'
        }}>
        <div className="events">
          <div className="events-header">
            <h1 className="events-title">{t('cleanAirSite.events.sectionTitles.upcoming')}</h1>
            <div className="events-header-buttons">
              <div style={{ position: 'relative' }}>
                <button onClick={() => setOpenDate(!openDate)}>
                  <span style={{ marginRight: '10px' }}>
                    {t('cleanAirSite.events.dropdowns.date.btnLabel')}
                  </span>{' '}
                  <DownArrow />
                </button>
                <Slide direction="down" in={openDate}>
                  <ul className="drop-down-list" ref={dateRef}>
                    {dates.map((date) => (
                      <li
                        key={date.value}
                        style={{
                          backgroundColor: date.value === selectedDate ? '#EBF5FF' : ''
                        }}
                        onClick={() => handleDateSelect(date.value)}>
                        {date.month}
                        {date.value === selectedDate && (
                          <DoneIcon sx={{ stroke: '#145FFF', width: '16px', height: '16px' }} />
                        )}
                      </li>
                    ))}
                  </ul>
                </Slide>
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setOpenFilter(!openFilter)}>
                  <FilterIcon />{' '}
                  <span style={{ marginLeft: '10px' }}>
                    {t('cleanAirSite.events.dropdowns.filter.btnLabel')}
                  </span>
                </button>
                <Slide direction="down" in={openFilter}>
                  <ul className="drop-down-list" ref={filterRef}>
                    <div className="label">{t('cleanAirSite.events.dropdowns.filter.label1')}</div>
                    <div>
                      {filterOption1.map((option) => (
                        <li
                          key={option.value}
                          style={{
                            backgroundColor: option.value === filter ? '#EBF5FF' : ''
                          }}
                          onClick={() => {
                            handleFilterSelect(option.value);
                          }}>
                          {option.label}
                          {option.value === filter && (
                            <DoneIcon sx={{ stroke: '#145FFF', width: '16px', height: '16px' }} />
                          )}
                        </li>
                      ))}
                    </div>
                    <div className="label">{t('cleanAirSite.events.dropdowns.filter.label2')}</div>
                    <div>
                      {filterOption2.map((option) => (
                        <li
                          key={option.value}
                          style={{
                            backgroundColor: option.value === filter ? '#EBF5FF' : ''
                          }}
                          onClick={() => {
                            setFilter(option.value);
                            setOpenFilter(false);
                          }}>
                          {option.label}
                          {option.value === filter && (
                            <DoneIcon sx={{ stroke: '#145FFF', width: '16px', height: '16px' }} />
                          )}
                        </li>
                      ))}
                    </div>
                  </ul>
                </Slide>
              </div>
            </div>
          </div>
          <div className="event-cards">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div className="event-card" key={event.id}>
                  <img src={event.event_image} alt="Event Image" className="event-image" />
                  <div className="even-card-details">
                    <h2 className="event-title">
                      {event.title.length > 50 ? event.title.slice(0, 50) + '...' : event.title}
                    </h2>
                    <p className="event-subtitle">
                      {event.title_subtext.length > 100
                        ? event.title_subtext.slice(0, 100) + '...'
                        : event.title_subtext}
                    </p>
                    <p className="event-date">
                      {format(new Date(event.start_date), 'dd MMMM, yyyy')}
                    </p>
                    <button className="event-button" onClick={routeToDetails(event)}>
                      {t('cleanAirSite.events.card.btnText')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <p>{t('cleanAirSite.events.noEvents')}</p>
              </div>
            )}
          </div>

          <hr />

          <div className="events-header">
            <h1 className="events-title">{t('cleanAirSite.events.sectionTitles.past')}</h1>
            <div>
              <button
                onClick={() => {
                  setHideEvents(!hideEvents);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}>
                <DownArrow />
              </button>
            </div>
          </div>
          {hideEvents && (
            <div className="event-cards">
              {currentEvents.length > 0 ? (
                <>
                  {currentEvents.map((event) => (
                    <div className="event-card" key={event.id}>
                      <img src={event.event_image} alt="Event Image" className="event-image" />
                      <div className="even-card-details">
                        <h2 className="event-title">
                          {event.title.length > 50 ? event.title.slice(0, 50) + '...' : event.title}
                        </h2>
                        <p className="event-subtitle">
                          {event.title_subtext.length > 100
                            ? event.title_subtext.slice(0, 100) + '...'
                            : event.title_subtext}
                        </p>
                        <p className="event-date">{event.date}</p>
                        <button className="event-button">
                          {t('cleanAirSite.events.card.btnText')}
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Pagination */}
                  <div className="pagination">
                    <button
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                      }}
                      disabled={currentPage === 1}>
                      <LeftArrow fill={currentPage === 1 ? '#D1D1D1' : '#000'} />
                    </button>
                    <p>
                      {currentPage} of {totalPages}
                    </p>
                    <button
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                      }}
                      disabled={currentPage === totalPages}>
                      <RightArrow fill={currentPage === totalPages ? '#D1D1D1' : '#000'} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-events">
                  <p>{t('cleanAirSite.events.noEvents')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Register Membership */}
      <RegisterSection link="https://docs.google.com/forms/d/e/1FAIpQLScIPz7VrhfO2ifMI0dPWIQRiGQ9y30LoKUCT-DDyorS7sAKUA/viewform" />
    </div>
  );
};

export default CleanAirEvents;
