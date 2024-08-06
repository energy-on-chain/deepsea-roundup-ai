import React, {useState, useEffect} from 'react';

import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';

import './HomePage.css';
import "./RegisterPage.css";

function RegisterSuccessPage(props) {   

  return (
    <AnimatedPage>
      <main>
        <section className="section-banner">
          <h1>Regsitration Success</h1>
        </section>
        <section className="section-hero2">
          <br/>
          <p><strong>Registration was successful!</strong></p>
          <br/>
          <p>Your payment has been processed via Stripe and you will receive an confirmation email receipt from them shortly.</p>
          <br/>
          <p><strong>See you at the event!</strong></p>
        </section>
        <Footer/>
      </main>
    </AnimatedPage>
  );
}

export default RegisterSuccessPage;

