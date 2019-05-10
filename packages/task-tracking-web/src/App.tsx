import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import './App.css';
import AuthenticateIntegrationPage from './pages/AuthenticateIntegrationPage';

// export interface IAppContext {
//   user: IUser,
//   userChanged: (user:IUser) => void,
//   userLogout: () => void,
//   setTheme: (theme: ThemeOptions) => void,
//   loadingUserInitial: boolean,
// }

// Temporarily initialize it
// const AppContext = React.createContext<IAppContext>({} as any);
// export const AppContextConsumer = AppContext.Consumer;

// interface IAppState {
//   loadingUserInitial: boolean,
//   user: IUser,
//   theme: Theme,
// }

// type IProps = IAxiosProps;

// export default withAxios<{}>(class App extends Component<IProps, IAppState> {
class App extends React.Component {
  // public readonly state = this.buildState({
  //   loadingUserInitial: true,
  //   theme: createMuiTheme(defaultTheme),
  //   user: {},
  // });

  // public async componentDidMount() {
  //   this.loadUser();
  // }

  public render() {
    // const {
    //   user,
    //   theme,
    //   loadingUserInitial,
    // } = this.state;
    return (
      <React.Fragment>
      {/*<MuiThemeProvider theme={theme}>
        <AppContext.Provider value={{
          loadingUserInitial,
          setTheme: this.setTheme,
          user,
          userChanged: this.handleUserChanged,
          userLogout: this.userLogout,
        }}>*/}
          <Switch>
            <Route exact={true} path="/" component={EntryPage} />
            <Route path="/authenticate-integration" component={AuthenticateIntegrationPage} />
          </Switch>
        {/*</AppContext.Provider>
        </MuiThemeProvider>*/}
      </React.Fragment>
    );
  }
};
export default App;
