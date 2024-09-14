import React, { useEffect, useState } from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa'

import './BackToTopButton.css';

import {
  CONFIG_STYLING_FOOTER_SECTION_DIVIDER_HIGHLIGHT_COLOR,
} from '../../config/stylingConfig';

function BackToTopButton() {

  const [BackToTopButton, setBackToTopButton] = useState(false);
  
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if(window.scrollY > 100) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    })
  }, [])

  return (
    <div>
      <a onClick={scrollUp} >
        <i style={{color: CONFIG_STYLING_FOOTER_SECTION_DIVIDER_HIGHLIGHT_COLOR}} ><FaAngleDoubleUp size={30}/></i>
      </a>
    </div>
    );
}

export default BackToTopButton;

