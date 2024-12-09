import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import AddTeamModal from '../components/modals/AddTeamModal';
import AddSponsorModal from '../components/modals/AddSponsorModal';
import { loadConfigForYear } from '../config/masterConfig'; // Dynamic config loader
import './RegisterPage.css';

function RegisterPage(props) {

  const { year: yearFromParams } = useParams(); // Get year from URL params
  const [searchParams] = useSearchParams(); // Get search params
  const yearFromSearch = searchParams.get('year');
  const year = props.year || yearFromParams || yearFromSearch || new Date().getFullYear();

  // General state
  const [teamsTableName, setTeamsTableName] = useState();
  const [sponsorsTableName, setSponsorsTableName] = useState();

  // Styling state
  const [bannerBgColor, setBannerBgColor] = useState('');
  const [bannerTextColor, setBannerTextColor] = useState('');
  const [titleTextColor, setTitleTextColor] = useState('');
  const [subtitleTextColor, setSubtitleTextColor] = useState('');
  const [buttonBgColor, setButtonBgColor] = useState();
  const [buttonTextColor, setButtonTextColor] = useState();
  const [buttonBorderColor, setButtonBorderColor] = useState();
  const [isAnglerRegistrationDisabled, setIsAnglerRegistrationDisable] = useState(false); 
  const [isSponsorRegistrationDisabled, setIsSponsorRegistrationDisable] = useState(false); 

  // Registration state
  const [isEarlyBird, setIsEarlyBird] = useState(false);
  const [earlyBird, setEarlyBird] = useState({
    adultEarlybirdFee: 0,
    juniorEarlybirdFee: 0,
    date: '',
  });
  const [normalFee, setNormalFee] = useState({
    adultNormalfee: 0,
    juniorNormalfee: 0,
    date: '',
  });
  const [disclaimers, setDisclaimers] = useState([]);
  const [configLoaded, setConfigLoaded] = useState(false); // Track if the config has loaded

  // Modal state
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isAddSponsorModalOpen, setIsAddSponsorModalOpen] = useState(false);

  const openAddTeamModal = () => {
    setIsAddTeamModalOpen(true);
  };

  const closeAddTeamModal = () => {
    setIsAddTeamModalOpen(false);
  };

  const openAddSponsorModal = () => {
    setIsAddSponsorModalOpen(true);
  };

  const closeAddSponsorModal = () => {
    setIsAddSponsorModalOpen(false);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadConfigForYear(year); // Load config dynamically based on the year
      if (config) {

        const generalConfig = config.generalConfig;
        const stylingConfig = config.stylingConfig;
        const registrationConfig = config.registrationConfig;

        // Set general config
        setTeamsTableName(generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME)
        setSponsorsTableName(generalConfig.CONFIG_GENERAL_FIREBASE_SPONSORS_TABLE_NAME)

        // Set styling config
        setBannerBgColor(stylingConfig.CONFIG_STYLING_BANNER_BACKGROUND_COLOR);
        setBannerTextColor(stylingConfig.CONFIG_STYLING_BANNER_TEXT_COLOR);
        setTitleTextColor(stylingConfig.CONFIG_STYLING_REGISTER_TITLE_TEXT_COLOR);
        setSubtitleTextColor(stylingConfig.CONFIG_STYLING_REGISTER_SUBTITLE_TEXT_COLOR);
        setButtonBgColor(stylingConfig.CONFIG_STYLING_BUTTON_BACKGROUND_COLOR);
        setButtonTextColor(stylingConfig.CONFIG_STYLING_BUTTON_TEXT_COLOR);
        setButtonBorderColor(stylingConfig.CONFIG_STYLING_BUTTON_BORDER_COLOR);

        // Set registration config
        setEarlyBird({
          hasEarlyBird: registrationConfig.CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION,
          adultEarlybirdFee: registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE,
          juniorEarlybirdFee: registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE,
          date: registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING,
        });
        setNormalFee({
          adultNormalfee: registrationConfig.CONFIG_REGISTRATION_NORMAL_ADULT_FEE,
          juniorNormalfee: registrationConfig.CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE,
          date: registrationConfig.CONFIG_REGISTRATION_NORMAL_DATE_STRING,
        });
        setDisclaimers(registrationConfig.CONFIG_REGISTRATION_DISCLAIMERS || []);

        const currentTime = new Date().getTime();
        console.log('currentTime', currentTime)
        console.log('config value', registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS)
        if (currentTime > registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS){
          setIsEarlyBird(false);
        } else {
          setIsEarlyBird(true);
        }
        if (currentTime > registrationConfig.CONFIG_ANGLER_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS) {
          setIsAnglerRegistrationDisable(true); // Disable the registration button
        }
        if (currentTime > registrationConfig.CONFIG_SPONSOR_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS) {
          setIsSponsorRegistrationDisable(true); // Disable the registration button
        }

        setConfigLoaded(true); // Set config loaded to true once everything is ready
      }
    };

    fetchConfig();
    setIsAddTeamModalOpen(false);
    setIsAddSponsorModalOpen(false);
  }, [year]);

  if (!configLoaded) {
    return <div>Loading...</div>; // Render a loading state while fetching the config
  }

  return (
    <AnimatedPage>
      <main>

        {/* BANNER */}
        <section style={{ backgroundColor: bannerBgColor }} className="section-banner">
          <h1 style={{ color: bannerTextColor }}>Register</h1>
        </section>

        <section className="section-register">

          <h1 style={{ color: titleTextColor }}>For Anglers ({year})</h1>

          {earlyBird.hasEarlyBird && (
            <>
              <h2 style={{ color: subtitleTextColor }}>
                ${earlyBird.adultEarlybirdFee.toLocaleString()} per adult, ${earlyBird.juniorEarlybirdFee.toLocaleString()} per junior
              </h2>
              <h4 style={{ color: subtitleTextColor }}>{earlyBird.date}</h4>
            </>
          )}

          {normalFee.adultNormalfee && (
            <>
              <h2 style={{ color: subtitleTextColor }}>
                ${normalFee.adultNormalfee.toLocaleString()} per adult, ${normalFee.juniorNormalfee.toLocaleString()} per junior
              </h2>
              <h4 style={{ color: subtitleTextColor }}>{normalFee.date}</h4>
            </>
          )}

          <button 
            style={{ 
              backgroundColor: isAnglerRegistrationDisabled ? '#AEBDC4' : buttonBgColor, // Grey background if disabled
              color: isAnglerRegistrationDisabled ? 'white' : buttonTextColor,  // Light text color if disabled
              borderColor: isAnglerRegistrationDisabled ? 'black' : buttonBorderColor  // Grey border if disabled
            }} 
            className="home-signup-button" 
            onClick={openAddTeamModal} 
            disabled={isAnglerRegistrationDisabled} // Disable the button if the cutoff is reached
            type="button"
          >
            {isAnglerRegistrationDisabled ? "Signup Closed!" : "Register Angler"} {/* Change the label */}
          </button>
          <br/>

          <h1 style={{ color: titleTextColor }}>For Sponsors ({year})</h1>
          <button 
            style={{ 
              backgroundColor: isSponsorRegistrationDisabled ? '#AEBDC4' : buttonBgColor, // Grey background if disabled
              color: isSponsorRegistrationDisabled ? 'white' : buttonTextColor,  // Light text color if disabled
              borderColor: isSponsorRegistrationDisabled ? 'black' : buttonBorderColor  // Grey border if disabled
            }} 
            className="home-signup-button" 
            onClick={openAddSponsorModal} 
            disabled={isSponsorRegistrationDisabled} // Disable the button if the cutoff is reached
            type="button"
          >
            {isSponsorRegistrationDisabled ? "Signup Closed!" : "Register Sponsor"} {/* Change the label */}
          </button>
          <br/>

          {configLoaded && (
            <>
              <AddTeamModal
                year={year}
                tableName={teamsTableName}
                isAdmin={false}
                status={isAddTeamModalOpen}
                open={openAddTeamModal}
                close={closeAddTeamModal}
                isEarlyBird={isEarlyBird}
                earlyBirdData={earlyBird}
                normalData={normalFee}
              />
              <AddSponsorModal
                year={year}
                tableName={sponsorsTableName}
                isAdmin={false}
                status={isAddSponsorModalOpen}
                open={openAddSponsorModal}
                close={closeAddSponsorModal}
              />
            </>
          )}

          {/* Disclaimers Section */}
          <br/>
          <h1 style={{ color: titleTextColor }}>Disclaimers</h1>
          {disclaimers && Object.keys(disclaimers).length > 0 && (
            <>
              {Object.entries(disclaimers).map(([disclaimerCategory, disclaimerDetails], index) => (
                <div key={index}>
                  <h2 style={{ color: titleTextColor }}>{disclaimerCategory}</h2><br/>
                  {disclaimerDetails.map((disclaimer, i) => (
                    <h4 key={i} style={{ color: subtitleTextColor }}>{disclaimer}</h4>
                  ))}
                  <br />
                </div>
              ))}
            </>
          )}

        </section>
        <Footer />
      </main>
    </AnimatedPage>
  );
}

export default RegisterPage;

