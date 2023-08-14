import React from 'react';
import Header from '../../components/OurProducts/Header';
import Page from '../Page';
import HeaderImage from '../../assets/img/OurProducts/Calibration/calibration-header.png';
import { useInitScrollTop } from 'utils/customHooks';
import Section1Image from '../../assets/img/OurProducts/Calibration/section-2.jpg';
import Section2Image from '../../assets/img/OurProducts/Calibration/refined.jpg';
import Section3Image from '../../assets/img/OurProducts/Calibration/section-3.png';
import NavTab from '../../components/nav/NavTab';

const CalibrationPage = () => {
  useInitScrollTop();
  return (
    <Page>
      <div className="product-page calibrate mobile-app analytics api">
        <Header
          style = {{ backgroundColor: '#e6e8fa' }}
          pageTitle={'AirQalibrate'}
          title={'Calibrate your low-cost sensor data'}
          subText={
            'Improve the accuracy and reliability of data from your low-cost air quality monitors using AirQo’s AirQalibrate tool, delivering more accurate results.'
          }>
          <img src={HeaderImage} alt="" style={{ borderRadius: '8px'}} />
        </Header>
        <div className="content">
          <div className="grid-wrapper column section">
            <div className="row">
              <h2 className="left title">
                <span className="blue"> Why calibrate</span> your low-cost sensor data?
              </h2>
              <p className="right">
              Low-cost air quality sensors  are relied on to increase the geographical coverage of air quality monitoring networks, 
              especially in low-resource settings where access to standard reference grade monitors is limited.<br/>
              
              However, the sensors are sensitive to ambient conditions such as humidity and temperature which could affect the 
              accuracy of air quality data and require field calibration to improve their performance.
              </p>
            </div>
            <div className="overlap-section">
              <div className="lapping-left card card-sm larger-top"  style={{ backgroundColor: '#FFFCE1' }}>
                <h5>Cost effective and accessible</h5>
                <p>
                AirQalibrate is a Machine Learning based calibration tool that eliminates the need for 
                reference grade monitor or on-site monitor calibration. 
                It enables users without access to reference grade monitors or technical expertise to calibrate data
                from their low-cost monitors and improve performance and build trust in the air quality network. 
                </p>
              </div>
              <div className="lapping-left image" style={{textAlign:'center', color:'gray'}} id="section-1">
                <img src={Section1Image} alt="" />
                <br/>
                
                <p><b>Improvement in data accuracy after field calibration</b></p>
              </div>
            </div>
          </div>

          <div className="grid-wrapper section">
            <div className="overlap-section">
              <div className="lapping-right card" style={{ backgroundColor: '#E6E6FA', marginTop: '30px' }}>
                <h5>Calibrate your data</h5>
                <p>
                Upload a CSV containing your low-cost sensor  PM<sub>2.5</sub> and PM<sub>10</sub> data follow simple steps and calibrate your data. 
                The results are automatically downloaded when the calibration process is completed.
                 <br/>
                <a href='https://airqalibrate.airqo.net/' target='_blank' className='download-button'> Calibrate your data </a>
                </p>

              </div>
              <div className="lapping-right image" id="section-2">
                <img src={Section2Image} alt="" />
              </div>
            </div>
          </div>

          <div className="grid-full column section landscape-section">
            <div className="column smaller-width mx-wdth-800px">
              <h2 className="left title">
                <span className="blue">Simple </span> user interface
              </h2>
              <p className="right ">
              Our calibration tool features a user-friendly interface that 
              simplifies the calibration process. 
              Even without technical expertise, you can easily 
              navigate the tool and calibrate the data from air quality monitors. <br/>
              <br/>
              The AirQalibrate reduces operational costs of monitoring thereby enabling the expansion 
              of monitoring systems to create a dense air quality monitoring and management network.
              </p>
              <NavTab text="Calibration guide" path="https://wiki.airqo.net/#/calibration/ml_based_approach" hideArrow filled />
            </div>
            <div className="image">
              <img src={Section3Image} alt="" />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CalibrationPage;
