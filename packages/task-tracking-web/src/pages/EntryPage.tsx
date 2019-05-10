import * as React from 'react';
// import {
//   RouterProps
// } from 'react-router';
// import axios from 'axios';
import { Theme, withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { NavLink } from 'react-router-dom';
// import { Prompt } from 'react-router-dom';

const styles = (theme: Theme): Record<string, CSSProperties> => ({
  button: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)
(class EntryPage extends React.Component {
  public render() {
    return (
      <>
      <h2>event tracking</h2>
      <NavLink to="/authenticate-integration">Authenticate 3rd Party Event Sources</NavLink>
      </>
    );
  }

});
