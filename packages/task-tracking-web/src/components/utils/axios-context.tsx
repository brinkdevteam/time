import * as React from 'react';
import {
  IAxiosInfo,
} from './AxiosProvider';

export const { Provider, Consumer, } = React.createContext<IAxiosInfo>({
  config: {},
  requestInterceptors: [],
  responseInterceptors: [],
});
