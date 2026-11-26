import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadConfigForYear } from './config/masterConfig';

function Redirect() {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    const getCurrentYearAndRedirect = async () => {
      // Use this year's config if it exists; otherwise fall back to the newest year that
      // has one (e.g. on Jan 1, before next year's config has been added).
      const thisYear = new Date().getFullYear();
      for (let year = thisYear; year >= thisYear - 5; year--) {
        const config = await loadConfigForYear(year);
        if (config && config.generalConfig) {
          setCurrentYear(config.generalConfig.CONFIG_GENERAL_YEAR || year);
          return;
        }
      }
      setCurrentYear(thisYear);
    };

    getCurrentYearAndRedirect();
  }, []);

  useEffect(() => {
    // When currentYear is set, redirect to the current year
    if (currentYear) {
      navigate(`/${currentYear}/home`, { replace: true });  // Redirect to /{year}/home
    }
  }, [currentYear, navigate]);

  return null;  // Nothing to display, just handles redirection
}

export default Redirect;

