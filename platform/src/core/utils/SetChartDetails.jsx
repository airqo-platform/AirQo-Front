import React from 'react';
import {
  setChartSites,
  setChartDataRange,
  setTimeFrame,
  setChartType,
  setPollutant,
  resetChartStore,
} from '@/lib/store/services/charts/ChartSlice';

// Define your function
const SetChartDetails = async (dispatch, chartData, userInfo, preferenceData) => {
  if (userInfo && preferenceData && preferenceData.length > 0) {
    const { period, selected_sites, startDate, endDate, frequency, chartType, pollutant } =
      preferenceData[0];
    try {
      const chartSites = selected_sites
        ? selected_sites.map((site) => site['_id'])
        : chartData.chartSites;

      await dispatch(setChartSites(chartSites.slice(0, 4)));
      await dispatch(
        setChartDataRange({
          startDate: startDate || chartData.chartDataRange.startDate,
          endDate: endDate || chartData.chartDataRange.endDate,
          label: period.label || chartData.chartDataRange.label,
        }),
      );
      await dispatch(setTimeFrame(frequency || chartData.timeFrame));
      await dispatch(setChartType(chartType || chartData.chartType));
      await dispatch(setPollutant(pollutant || chartData.pollutionType));
    } catch (error) {
      console.error(`Error setting chart properties: ${error}`);
    }
  } else if (userInfo && preferenceData && preferenceData.length === 0) {
    await dispatch(setChartSites(chartData.chartSites.slice(0, 4)));
    await dispatch(
      setChartDataRange({
        startDate: chartData.chartDataRange.startDate,
        endDate: chartData.chartDataRange.endDate,
        label: chartData.chartDataRange.label,
      }),
    );
    await dispatch(setTimeFrame(chartData.timeFrame));
    await dispatch(setChartType(chartData.chartType));
    await dispatch(setPollutant(chartData.pollutionType));
  } else {
    dispatch(resetChartStore());
  }
};

export default SetChartDetails;
