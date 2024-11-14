import { Metadata } from 'next';
import React from 'react';

import Navbar from '@/components/layouts/Navbar';

export const metadata: Metadata = {
  title: 'Contact Us | AirQo - Get in Touch for Air Quality Solutions',
  description:
    'Reach out to AirQo for inquiries, partnerships, or support. Whether you are looking for air quality data, seeking collaboration, or need assistance with our tools and services, our team is ready to assist.',
  keywords:
    'Contact AirQo, air quality contact, AirQo support, AirQo inquiries, air pollution solutions contact, environmental health contact, air quality partnerships, AirQo office contact',
  openGraph: {
    title: 'Contact AirQo - Air Quality Inquiries and Support',
    description:
      'Get in touch with AirQo for inquiries about air quality data, partnerships, or support with our air quality monitoring solutions across Africa.',
    url: 'https://yourdomain.com/contact',
    siteName: 'AirQo',
    images: [
      {
        url: 'https://yourdomain.com/static/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact AirQo for Air Quality Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AirQo',
    title: 'Contact AirQo - Get Support and Inquiries',
    description:
      'Reach out to AirQo for inquiries, partnerships, and support related to air quality monitoring and data solutions in Africa.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://yourdomain.com/contact',
  },
};

type ContactLayoutProps = {
  children: React.ReactNode;
};

const ContactLayout: React.FC<ContactLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden">
      <div className="w-full border-b border-gray-200 sticky top-0 z-50">
        <Navbar />
      </div>
      <main>{children}</main>
    </div>
  );
};

export default ContactLayout;