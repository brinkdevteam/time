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
        <a href="https://account.withings.com/oauth2_user/authorize2?response_type=code&mode=demo&client_id=05094ce5e64c11ab4fe03f0c699d3bb9fbc41d6c52f4b62d932b619934216889&state=trackingapp&scope=user.info,user.metrics,user.activity&redirect_uri=http://alb83.com/api/module/withings/auth/callback">Withings</a>
      </div>
      </>
    );
  }

});
