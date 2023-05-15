import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect, useParams, useRouteMatch } from 'react-router-dom';
import 'chartjs-plugin-annotation';
import { isEmpty } from 'underscore';

//css
import 'assets/css/device-view.css';

// others
import { DeviceToolBar, DeviceToolBarContainer } from './DeviceToolBar';
import DeviceEdit from './DeviceEdit';
import DeviceLogs from './DeviceLogs';
import DevicePhotos from './DevicePhotos';
import DeviceOverview from './DeviceOverview/DeviceOverview';
import { useDevicesData } from 'redux/DeviceRegistry/selectors';
import { loadDevicesData } from 'redux/DeviceRegistry/operations';
import { useInitScrollTop } from 'utils/customHooks';
import { withPermission } from '../../../containers/PageAccess';

function DeviceView() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const params = useParams();
  const devices = useDevicesData();
  const [deviceData, setDeviceData] = useState(devices[params.deviceName] || {});

  useInitScrollTop();

  useEffect(() => {
    if (isEmpty(devices)) {
      const activeNetwork = JSON.parse(localStorage.getItem('activeNetwork'));
      if (!isEmpty(activeNetwork)) {
        dispatch(loadDevicesData(activeNetwork.net_name));
      }
    }
  }, []);

  useEffect(() => {
    setDeviceData(devices[params.deviceName] || {});
  }, [devices]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <DeviceToolBar deviceName={deviceData.name} />
      <DeviceToolBarContainer>
        <Switch>
          <Route
            exact
            path={`${match.url}/overview`}
            component={() => <DeviceOverview deviceData={deviceData} />}
          />
          <Route
            exact
            path={`${match.url}/edit`}
            component={() => <DeviceEdit deviceData={deviceData} />}
          />
          <Route
            exact
            path={`${match.url}/maintenance-logs`}
            component={() => (
              <DeviceLogs deviceName={deviceData.name} deviceLocation={deviceData.locationID} />
            )}
          />
          <Route
            exact
            path={`${match.url}/photos`}
            component={() => <DevicePhotos deviceData={deviceData} />}
          />
          <Redirect to={`${match.url}/overview`} />
        </Switch>
      </DeviceToolBarContainer>
    </div>
  );
}

export default withPermission(DeviceView, 'CREATE_UPDATE_AND_DELETE_NETWORK_DEVICES');
