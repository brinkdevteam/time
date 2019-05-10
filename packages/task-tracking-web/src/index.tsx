import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, } from 'react-router-dom';
import './index.css';
import App from './App';
import AxiosProvider, { IAxiosInfo } from './components/utils/AxiosProvider';

import * as serviceWorker from './serviceWorker';

const buildAxiosInfo = (info: IAxiosInfo) => {
  return {
    ...info,
    config: {
      ...info.config,
      baseURL: `${process.env.PUBLIC_URL}/api/`,
    },
  };
};

ReactDOM.render(
  <AxiosProvider buildAxiosInfo={buildAxiosInfo}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AxiosProvider>,
  document.getElementById('root') as HTMLElement
);

serviceWorker.register();
