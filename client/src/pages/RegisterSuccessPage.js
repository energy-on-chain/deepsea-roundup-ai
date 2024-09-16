import React, {useState, useEffect} from 'react';

import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';

import {
  CONFIG_STYLING_BANNER_BACKGROUND_COLOR,
  CONFIG_STYLING_BANNER_TEXT_COLOR,
  CONFIG_STYLING_H2_COLOR,
  CONFIG_STYLING_P_COLOR,
} from '../config/stylingConfig';

import './HomePage.css';
import "./RegisterPage.css";

function RegisterSuccessPage(props) {   

  return (
    <AnimatedPage>
      <main>
        <section className="section-banner" style={{ backgroundColor: CONFIG_STYLING_BANNER_BACKGROUND_COLOR }}>
          <h1 style={{color: CONFIG_STYLING_BANNER_TEXT_COLOR}}>Registration Success</h1>
        </section>
        <section className="section-hero2">
          <br/>
          <p style={{color: CONFIG_STYLING_P_COLOR}}><strong>Registration was successful!</strong></p>
          <br/>
          <p style={{color: CONFIG_STYLING_P_COLOR}}>Your payment has been processed via Stripe and you will receive an confirmation email receipt from them shortly.</p>
          <br/>
          <p style={{color: CONFIG_STYLING_P_COLOR}}><strong>See you at the event!</strong></p>
        </section>
        <Footer/>
      </main>
    </AnimatedPage>
  );
}

export default RegisterSuccessPage;

