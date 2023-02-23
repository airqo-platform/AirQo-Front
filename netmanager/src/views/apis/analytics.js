import axios from 'axios';
import {
  GET_DATA_MAP,
  GET_SITES,
  DOWNLOAD_CUSTOMISED_DATA_URI,
  D3_CHART_DATA_URI
} from 'config/urls/analytics';
import { URBAN_BETTER_DOWNLOAD_DATA_URI } from '../../config/urls/analytics';

axios.defaults.headers.common.Authorization = `JWT ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`;

export const getMonitoringSitesInfoApi = async (pm25Category) => {
  return await axios.get(GET_DATA_MAP + pm25Category).then((response) => response.data);
};

export const getSitesApi = async () => {
  return await axios.get(GET_SITES).then((response) => response.data);
};

export const downloadDataApi = async (data) => {
  return axios.post(DOWNLOAD_CUSTOMISED_DATA_URI, data).then((response) => response.data);
};

export const loadD3ChartDataApi = async (data) => {
  return await axios.post(D3_CHART_DATA_URI, data).then((response) => response.data);
};

export const downloadUrbanBetterDataApi = async (data) => {
  return await axios.post(URBAN_BETTER_DOWNLOAD_DATA_URI, data).then((response) => response.data);
};
