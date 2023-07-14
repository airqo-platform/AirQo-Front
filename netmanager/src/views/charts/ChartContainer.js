import React from 'react';
import PropTypes from 'prop-types';
import AccessTime from '@material-ui/icons/AccessTime';
import { humanReadableDate } from 'utils/dateTime';

// css
import 'assets/css/chart-container.css';
import { CircularProgress } from '@material-ui/core';

const ChartContainer = ({
  className,
  title,
  lastUpdated,
  blue,
  green,
  centerItems,
  footerContent,
  controller,
  children,
  loading,
  type
}) => {
  const titleStyle = (blue && 'title-blue') || (green && 'title-green') || 'title-default';
  return (
    <div className={className || 'chart-container-wrapper'}>
      <div className={`chart-title-wrapper ${titleStyle}`}>
        <span className={'chart-title'}>{title}</span>
        <span className={'chart-control'}>{controller}</span>
      </div>
      <div className={`chart-body ${(centerItems && 'chart-flex-center-body') || ''}`}>
        {loading ? <CircularProgress /> : children}
      </div>
      <div className={'chart-footer'}>
        {lastUpdated && (
          <span>
            <AccessTime /> Last updated{' '}
            {humanReadableDate(lastUpdated, {
              format: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              }
            })}
          </span>
        )}
        {footerContent && <span>{footerContent}</span>}
      </div>
    </div>
  );
};

ChartContainer.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  options: PropTypes.object,
  series: PropTypes.array,
  lastUpdated: PropTypes.any,
  blue: PropTypes.bool,
  green: PropTypes.bool,
  centerItems: PropTypes.bool,
  footerContent: PropTypes.any,
  controller: PropTypes.any,
  children: PropTypes.element
};

export default ChartContainer;
