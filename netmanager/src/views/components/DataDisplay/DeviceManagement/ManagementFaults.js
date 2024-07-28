import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import ErrorBoundary from 'views/ErrorBoundary/ErrorBoundary';
import CustomMaterialTable from '../../Table/CustomMaterialTable';
import { faultsPredictApi } from 'views/apis/predict';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  title: {
    fontWeight: 700,
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Open Sans'
  }
}));

const faultColumns = [
  {
    title: 'Device ID',
    field: 'device_id',
    render: (rowData) => {
      return rowData ? rowData.device_id : '';
    },
    headerStyle: { textAlign: 'left' }
  },
  {
    title: 'Correlation Fault',
    field: 'correlation_fault',
    render: (rowData) => {
      return rowData ? rowData.correlation_fault : '';
    },
    cellStyle: { width: '25%', textAlign: 'center' },
    headerStyle: { textAlign: 'center' }
  },
  {
    title: 'Correlation Value',
    field: 'correlation_value',
    render: (rowData) => {
      return rowData ? rowData.correlation_value : '';
    },
    cellStyle: { fontFamily: 'Open Sans', width: '25%', textAlign: 'center' },
    headerStyle: { textAlign: 'center' }
  },
  {
    title: 'Missing Data Fault',
    field: 'Missing_data_fault',
    render: (rowData) => {
      return rowData ? rowData.missing_data_fault : '';
    },
    cellStyle: { width: '25%', textAlign: 'center' },
    headerStyle: { textAlign: 'center' }
  },
  {
    title: 'Fault Count',
    field: 'fault_count',
    render: (rowData) => {
      return rowData ? rowData.fault_count : '';
    },
    cellStyle: { width: '25%', textAlign: 'center' },
    headerStyle: { textAlign: 'center' }
  },
  {
    title: 'Anomaly Percentage',
    field: 'anomaly_percentage',
    render: (rowData) => {
      return rowData ? rowData.anomaly_percentage : '';
    },
    cellStyle: { width: '25%', textAlign: 'center' },
    headerStyle: { textAlign: 'center' }
  },
  {
    title: 'Created At',
    field: 'created_at',
    render: (rowData) => {
      if (rowData) {
        const date = new Date(rowData.created_at);
        return date.toLocaleString();
      } else {
        return '';
      }
    },
    headerStyle: { textAlign: 'center' }
  }
];

const ManagementFaults = () => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);
  const [faults, setFaults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await faultsPredictApi();
        if (response) {
          setFaults(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ErrorBoundary>
      <br />
      <div className={classes.root}>
        <CustomMaterialTable
          title="Faults"
          userPreferencePaginationKey={'faults'}
          columns={faultColumns}
          data={faults}
          isLoading={isLoading}
          options={{
            search: true,
            exportButton: false,
            searchFieldAlignment: 'left',
            showTitle: false,
            searchFieldStyle: {
              fontFamily: 'Open Sans'
            },
            headerStyle: {
              fontFamily: 'Open Sans',
              fontSize: 16,
              fontWeight: 600
            }
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ManagementFaults;
