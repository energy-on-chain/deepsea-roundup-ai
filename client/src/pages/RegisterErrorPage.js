import React, {useState, useEffect} from 'react';

import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';

import { 
  CONFIG_GENERAL_CONTACT_FOOTER_EMAIL_STRING,
} from '../config/generalConfig';

import {
  CONFIG_STYLING_BANNER_BACKGROUND_COLOR,
  CONFIG_STYLING_BANNER_TEXT_COLOR,
  CONFIG_STYLING_H2_COLOR,
  CONFIG_STYLING_P_COLOR,
} from '../config/stylingConfig';

import './HomePage.css';
import "./RegisterPage.css";

function RegisterErrorPage(props) {   

  return (
    <AnimatedPage>
      <main>
      <section className="section-banner" style={{ backgroundColor: CONFIG_STYLING_BANNER_BACKGROUND_COLOR }}>
          <h1 style={{color: CONFIG_STYLING_BANNER_TEXT_COLOR}}>Registration Error</h1>
        </section>
        <section className="section-hero2">
          <br/>
          <p style={{color: CONFIG_STYLING_P_COLOR}}><strong>An error occurred during the registration process.</strong></p>
          <br/>
          <p style={{color: CONFIG_STYLING_P_COLOR}}>Your card has not been charged. Please try again or contact the site administrators listed below for assistance.</p>
          <br/>
          {/* <p style={{color: CONFIG_STYLING_P_COLOR}}><strong>({CONFIG_GENERAL_CONTACT_FOOTER_EMAIL_STRING})</strong></p> */}
        </section>

        <Footer/>
      </main>
    </AnimatedPage>
  );
}

export default RegisterErrorPage;

