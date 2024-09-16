import RootNavigation from "../components/RootNavigation";

import {
  CONFIG_STYLING_H2_COLOR,
  CONFIG_STYLING_P_COLOR,
} from '../config/stylingConfig';

function ErrorPage() {
  return (
    <>
      <main>
        <br/>
        <br/>
        <h2 style={{color: CONFIG_STYLING_H2_COLOR}} >An error occurred!</h2>
        <p style={{color: CONFIG_STYLING_P_COLOR}}>Could not find this page :(</p>
        <p style={{color: CONFIG_STYLING_P_COLOR}}>Please refresh your browser.</p>
      </main>
    </>
  );
}

export default ErrorPage;

