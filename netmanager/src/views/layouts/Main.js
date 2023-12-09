import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { Topbar, Footer } from './common';
import { useSelector } from 'react-redux';

import Sidebar from './common/Sidebar';
import HorizontalLoader from '../components/HorizontalLoader/HorizontalLoader';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    minHeight: 'calc(100vh - 114px)'
  }
}));

const Main = (props) => {
  const { children } = props;
  const loaderStatus = useSelector((state) => state.HorizontalLoader.loading);

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}>
      <Topbar toggleSidebar={toggleSidebar} />
      <div style={{ position: 'relative' }}>
        <HorizontalLoader loading={loaderStatus} />
      </div>

      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>{children}</main>
      <Footer />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
