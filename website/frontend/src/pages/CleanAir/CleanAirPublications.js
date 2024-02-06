import React, { useEffect, useState, useRef } from 'react';
import SEO from 'utilities/seo';
import { useInitScrollTop } from 'utilities/customHooks';
import { isEmpty } from 'underscore';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveResource } from 'reduxStore/CleanAirNetwork/CleanAir';
import { ReportComponent } from 'components/CleanAir';
import { getAllCleanAirApi } from 'apis/index.js';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import useWindowSize from 'utilities/customHooks';
import Loadspinner from 'src/components/LoadSpinner/SectionLoader';
import { useTranslation, Trans } from 'react-i18next';

const ResourceMenuItem = ({ activeResource, resource, dispatch, setToggle }) => {
  const { width } = useWindowSize();
  const isActive = activeResource === resource;
  const className = isActive ? 'active' : 'resource-menu-item-link';
  const onClick = () => {
    dispatch(setActiveResource(resource));
    if (width < 1081) {
      setToggle();
    }
  };

  return (
    <li className={className} onClick={onClick}>
      {resource.charAt(0).toUpperCase() + resource.slice(1)}
    </li>
  );
};

const CleanAirPublications = () => {
  useInitScrollTop();
  const { t } = useTranslation();
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [cleanAirResources, setCleanAirResources] = useState([]);
  const activeResource = useSelector((state) => state.cleanAirData.activeResource);
  const resources = [
    t('cleanAirSite.publications.navs.toolkits'),
    t('cleanAirSite.publications.navs.reports'),
    t('cleanAirSite.publications.navs.workshops'),
    t('cleanAirSite.publications.navs.research')
  ];
  const { width } = useWindowSize();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEmpty(activeResource)) {
      dispatch(setActiveResource(t('cleanAirSite.publications.navs.toolkits')));
    }
  }, [activeResource]);

  useEffect(() => {
    setLoading(true);
    getAllCleanAirApi()
      .then((response) => {
        setCleanAirResources(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const resourceMenuItem = document.querySelector('.menu-wrapper');
    if (width < 1081) {
      resourceMenuItem.style.display = 'none';
    } else {
      resourceMenuItem.style.display = 'block';
    }
  }, [width]);

  const handleToggle = () => {
    setToggle(!toggle);
    const resourceMenuItem = document.querySelector('.menu-wrapper');
    if (toggle) {
      resourceMenuItem.style.display = 'none';
    } else {
      resourceMenuItem.style.display = 'block';
    }
  };

  const toolkitData = cleanAirResources.filter(
    (resource) => resource.resource_category === 'toolkit'
  );
  const technicalReportData = cleanAirResources.filter(
    (resource) => resource.resource_category === 'technical_report'
  );
  const workshopReportData = cleanAirResources.filter(
    (resource) => resource.resource_category === 'workshop_report'
  );
  const researchPublicationData = cleanAirResources.filter(
    (resource) => resource.resource_category === 'research_publication'
  );

  const ITEMS_PER_PAGE = 4;

  const renderData = (data, showSecondAuthor) => {
    const indexOfLastItem = activePage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
      return (
        <div style={{ marginTop: '100px' }}>
          <Loadspinner />
        </div>
      );
    }

    if (currentItems.length === 0 || !currentItems) {
      return (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            color: '#808080',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px'
          }}>
          <h1>{t('cleanAirSite.publications.noResources')}</h1>
        </div>
      );
    }

    return currentItems.map((resource, index) => (
      <div key={index}>
        <ReportComponent
          title={resource.resource_title}
          authors={resource.resource_authors}
          link={resource.resource_link}
          linkTitle="Read Journal"
          showSecondAuthor={showSecondAuthor}
          resourceFile={resource.resource_file}
        />
      </div>
    ));
  };

  const [activePage, setActivePage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    setActivePage(1);
  }, [activeResource]);

  const renderPagination = () => {
    let data;
    switch (activeResource) {
      case t('cleanAirSite.publications.navs.toolkits'):
        data = toolkitData;
        break;
      case t('cleanAirSite.publications.navs.reports'):
        data = technicalReportData;
        break;
      case t('cleanAirSite.publications.navs.workshops'):
        data = workshopReportData;
        break;
      case t('cleanAirSite.publications.navs.research'):
        data = researchPublicationData;
        break;
      default:
        data = [];
    }

    if (data.length <= ITEMS_PER_PAGE) {
      return null;
    }

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / ITEMS_PER_PAGE); i++) {
      pageNumbers.push(i);
    }

    const handlePrevPage = () => {
      if (activePage > 1) {
        setActivePage(activePage - 1);
      }
      document.getElementById('top-menu-sec').scrollIntoView();
    };

    const handleNextPage = () => {
      if (activePage < pageNumbers.length) {
        setActivePage(activePage + 1);
      }
      document.getElementById('top-menu-sec').scrollIntoView();
    };

    return (
      <nav className="list-page events">
        <ul className="pagination">
          <li className="page-item">
            <a onClick={handlePrevPage} className="page-link">
              {'<'}
            </a>
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a onClick={() => handlePageChange(number)} className="page-link">
                {number}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a onClick={handleNextPage} className="page-link">
              {'>'}
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="page-wrapper">
      <SEO
        title="Partners"
        siteTitle="CLEAN-Air Network"
        description="CLEAN-Air Africa Network is a network of African cities and partners committed to improving air quality and reducing carbon emissions through knowledge sharing and capacity building."
      />

      <div>
        <div className="partners">
          <div className="partners-wrapper" style={{ marginTop: '20px' }}>
            <div className="resources-container">
              <div className="resource-menu" id="top-menu-sec">
                <div className="title-wrapper">
                  <h1 className="resource-menu-title">
                    <Trans i18nKey="cleanAirSite.publications.title">
                      RESOURCE
                      <br />
                      <span>CENTER</span>
                    </Trans>
                  </h1>

                  <div className="resource-menu-icon" onClick={handleToggle}>
                    {toggle ? <CloseIcon fontSize="large" /> : <ListIcon fontSize="large" />}
                  </div>
                </div>
                <div className="menu-wrapper" ref={menuRef}>
                  <ul className="resource-menu-item">
                    {resources.map((resource) => (
                      <ResourceMenuItem
                        key={resource}
                        activeResource={activeResource}
                        resource={resource}
                        dispatch={dispatch}
                        setToggle={handleToggle}
                      />
                    ))}
                  </ul>
                </div>
              </div>

              <div className="resource-body">
                {activeResource === t('cleanAirSite.publications.navs.toolkits') &&
                  renderData(toolkitData, false)}
                {activeResource === t('cleanAirSite.publications.navs.reports') &&
                  renderData(technicalReportData, true)}
                {activeResource === t('cleanAirSite.publications.navs.workshops') &&
                  renderData(workshopReportData, true)}
                {activeResource === t('cleanAirSite.publications.navs.research') &&
                  renderData(researchPublicationData)}
                {renderPagination(activeResource)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanAirPublications;
