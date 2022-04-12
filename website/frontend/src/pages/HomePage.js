import React from 'react';
import Page from './Page';
import Hero from '../components/Hero';
import Monitor from '../components/Monitor';
import GetApp from '../components/get-app/GetApp';
import MapSection from '../components/MapSection/MapSection';
import Partners from '../components/Partners';
import { NewsletterSection } from '../components/NewsletterSection';
import { AnalyticsSection } from '../components/AnalyticsSection';
import ApiSection from '../components/ApiSection/ApiSection';

const HomePage = () => (
    <Page>
        <div className="HomePage">
            <Hero />
            <Partners />
            <Monitor />
            <AnalyticsSection />
            <ApiSection />
            <MapSection />
            <GetApp />
        </div>
    </Page>
);

export default HomePage;
