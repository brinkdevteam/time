import * as React from 'react';
// import {
//   RouterProps
// } from 'react-router';
// import axios from 'axios';
import { Theme, withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
// import { Prompt } from 'react-router-dom';

const styles = (theme: Theme): Record<string, CSSProperties> => ({
  button: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)
(class AuthenticateIntegrationPage extends React.Component {
  public render() {
    return (
      <>
      <h1>Authenticate Integrations</h1>
      <p>Please allow access to whichever third party services you wish this platform to access while tracking you!</p>
      <div style={{boxShadow: '0 0 30px grey', background: 'white', borderRadius: 3, display: 'flex', maxWidth: '10em', padding: '1em'}}>
        <a href={`${process.env.PUBLIC_URL}/api/module/withings/auth`}>Withings</a>
      </div>
      </>
    );
  }

});
