import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import AddTeamModal from '../components/modals/AddTeamModal';
import "./RegisterPage.css";

import { 
  CONFIG_STYLING_BANNER_BACKGROUND_COLOR,
  CONFIG_STYLING_BANNER_TEXT_COLOR,
  CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR,
  CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR,
  CONFIG_STYLING_BUTTON_BORDER_COLOR,
  CONFIG_STYLING_BUTTON_BACKGROUND_COLOR,
  CONFIG_STYLING_BUTTON_TEXT_COLOR,
} from '../config/stylingConfig';

import {
  CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION,
  CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING,
  CONFIG_REGISTRATION_EARLYBIRD_FEE,
  CONFIG_REGISTRATION_NORMAL_DATE_STRING,
  CONFIG_REGISTRATION_NORMAL_FEE,
  CONFIG_REGISTRATION_HAS_DISCLAIMERS,
  CONFIG_REGISTRATION_DISCLAIMERS,
  CONFIG_REGISTRATION_PAID_ADD_ONS,
} from '../config/registrationConfig';


function RegisterPage(props) {   
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

  const openAddTeamModal = () => {
    setIsAddTeamModalOpen(true);
  };

  const closeAddTeamModal = () => {
    setIsAddTeamModalOpen(false);
  };

  useEffect(() => {
    setIsAddTeamModalOpen(false);
  }, []);

  return (
    <AnimatedPage>
      <main>

        {/* BANNER */}
        <section style={{ backgroundColor: CONFIG_STYLING_BANNER_BACKGROUND_COLOR }} className="section-banner">
          <h1 style={{ color: CONFIG_STYLING_BANNER_TEXT_COLOR }}>Register</h1>
        </section>

        <section className="section-register">
          <h1 style={{color: CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR}}>Entry Fee</h1>

          {CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION && (
            <>
              <h2 style={{color: CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR}}>
                ${CONFIG_REGISTRATION_EARLYBIRD_FEE.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} per team
              </h2>
              <h4 style={{color: CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR}}>{CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING}</h4>
            </>
          )}

          <h2 style={{color: CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR}}>
            ${CONFIG_REGISTRATION_NORMAL_FEE.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} per team
          </h2>
          <h4 style={{color: CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR}}>{CONFIG_REGISTRATION_NORMAL_DATE_STRING}</h4>
          <br/>
          <br/>

          {CONFIG_REGISTRATION_PAID_ADD_ONS && (
            <>
              <h1 style={{color: CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR}}>Add-Ons</h1>
              {Object.entries(CONFIG_REGISTRATION_PAID_ADD_ONS).map(([title, addOns], index) => (
                <div key={index}>
                  <h3 style={{color: CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR}}>{title}</h3>
                  {addOns.map((addOn, i) => (
                    <h4 key={i} style={{color: CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR}}>{addOn}</h4>
                  ))}
                  <br/>
                </div>
              ))}
            </>
          )}

          <button 
            style={{backgroundColor: CONFIG_STYLING_BUTTON_BACKGROUND_COLOR, color: CONFIG_STYLING_BUTTON_TEXT_COLOR, borderColor: CONFIG_STYLING_BUTTON_BORDER_COLOR}} 
            className="home-signup-button" 
            onClick={openAddTeamModal} 
            type="button"
          >
            Signup Now!
          </button>  
          <AddTeamModal isAdmin={false} status={isAddTeamModalOpen} open={openAddTeamModal} close={closeAddTeamModal}/>

          {CONFIG_REGISTRATION_HAS_DISCLAIMERS && (
            <>
              <br/>
              <h1 id="disclaimer" style={{color: CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR}}>Disclaimers</h1>
              {Object.entries(CONFIG_REGISTRATION_DISCLAIMERS).map(([title, disclaimers], index) => (
                <div key={index}>
                  <h3 style={{color: CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR}}>{title}</h3>
                  {disclaimers.map((disclaimer, i) => (
                    <h4 key={i} style={{color: CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR}}>{disclaimer}</h4>
                  ))}
                  <br/>
                </div>
              ))}
            </>
          )}
        </section>
        <Footer/>
      </main>
    </AnimatedPage>
  );
}

export default RegisterPage;

