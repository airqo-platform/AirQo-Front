import React from 'react';
import { useInitScrollTop } from 'utilities/customHooks';
import { SplitSection, MainHighlight, ButtonCTA } from 'components/CleanAir';
import Section1 from 'assets/img/cleanAir/section1.jpg';
import Section2 from 'assets/img/cleanAir/section2.png';
import Section3 from 'assets/img/cleanAir/section3.png';
import Section4 from 'assets/img/cleanAir/section4.png';
import Section5 from 'assets/img/cleanAir/section5.png';
import T1 from 'assets/img/cleanAir/6.jpg';
import SEO from 'utilities/seo';

const Button = ({ className, label, onClick, style }) => (
  <button className={className || 'button-hero'} onClick={onClick} style={style}>
    {label}
  </button>
);

const CleanAirAbout = () => {
  useInitScrollTop();
  return (
    <>
      <SEO
        title="CLEAN-Air Africa Network"
        siteTitle="AirQo"
        description="An African led, multi-region network bringing together a community of practice for air quality solutions and air quality management across Africa."
      />
      {/* section 1 */}
      <div className="Hero">
        <span className="image-container">
          <img src={T1} />
        </span>
        <div className="hero-content">
          <div>
            <p className="hero-title">
              The CLEAN-Air Africa <br className="breaker" /> Network
            </p>
            <p className="hero-sub">
              <span className="fact">An African-led, multi-region network</span> <br />
              bringing together a community of practice for air quality solutions and air quality
              management across Africa.
            </p>
            <ButtonCTA
              label="Join the Network"
              link="https://docs.google.com/forms/d/e/1FAIpQLScIPz7VrhfO2ifMI0dPWIQRiGQ9y30LoKUCT-DDyorS7sAKUA/viewform"
              style={{
                width: '200px'
              }}
            />
          </div>
        </div>
      </div>
      {/* section 2 */}
      <SplitSection
        pillTitle="CLEAN-Air Mission"
        title="Our mission is"
        content="To strengthen regional networks for sustained partnerships and enable partners to co-develop solutions that enhance the capacity for air quality monitoring and managements across selected cities in Africa."
        btnText={'Learn how -->'}
        showButton={false}
        link="#"
        imgURL={Section2}
        bgColor="#EDF3FF"
        pillBgColor="#FFFFFF"
        pillTextColor="#000000"
      />
      {/* section 3 */}
      <SplitSection
        pillTitle="CLEAN-Air"
        content="CLEAN-Air, an acronym coined from ‘Championing Liveable urban Environments through African Networks for Air’, brings together stakeholders and researchers in air quality management from over 16 cities across the African continent to share best practices and knowledge on developing and implementing air quality management solutions."
        imgURL={Section3}
        imageStyle={{
          width: '214px',
          height: '214px',
          objectFit: 'cover'
        }}
        bgColor="#FFFFFF"
        pillBgColor="#ECF2FF"
        pillTextColor="#135DFF"
        reverse
        showButton={false}
      />
      {/* section 4 */}
      <SplitSection
        pillTitle="CLEAN-Air Membership"
        title="A Synergy for air quality in Africa"
        content="Are you an organization or individual interested in air quality in Africa? We implore you to join the CLEAN-Air Africa Network. <br/> <br/> The CLEAN-Air network is supported by development partners and philanthropic organizations, including the U.S. Department of State, Google.org, which have an established history of pioneering continuous air quality monitoring in data-hungry cities through the U.S. Embassies across Africa."
        link="#"
        btnText={'Get involved -->'}
        imgURL={Section4}
        imageStyle={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        bgColor="#EDF3FF"
        pillBgColor="#FFFFFF"
        pillTextColor="#000000"
        showButton={false}
      />
      {/* section 5 */}
      <SplitSection
        pillTitle="CLEAN-Air Goals"
        imgURL={Section5}
        bgColor="#FFFFFF"
        pillBgColor="#ECF2FF"
        pillTextColor="#135DFF"
        showButton={false}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem'
          }}>
          <div>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#135DFF'
              }}>
              Enhancing Regional Capacity
            </span>
            :  We are dedicated to improving capacity in air quality monitoring, modeling, data
            management and access through scaling up of ongoing localized initiatives in African
            Cities.
          </div>
          <div>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#135DFF'
              }}>
              Driving awareness
            </span>
            :  We are committed to fostering a deeper understanding, awareness and appreciation of
            air quality issues through evidence-informed and participatory advocacy approaches.
          </div>
          <div>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#135DFF'
              }}>
              Building clean air solutions
            </span>
            :  We are not just a network; we are a nexus for developing tangible clean air solutions
            and comprehensive frameworks that cater specifically to the unique challenges faced by
            African cities.
          </div>
        </div>
      </SplitSection>
      {/* section 6 */}
      <MainHighlight />
    </>
  );
};

export default CleanAirAbout;
