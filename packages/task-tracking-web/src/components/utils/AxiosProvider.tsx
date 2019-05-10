import {
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as React from 'react';
import {
  Consumer,
  Provider,
} from './axios-context';

export interface IAxiosInterceptor<V> {
  onFulfilled?: (value: V) => V | Promise<V>;
  onRejected?: (error: any) => any;
}

export interface IAxiosInfo {
  config: AxiosRequestConfig;
  requestInterceptors: Array<IAxiosInterceptor<AxiosRequestConfig>>;
  responseInterceptors: Array<IAxiosInterceptor<AxiosResponse>>;
}

export interface IAxiosProviderProps {
  /**
   * Build new info or return parent’s. Do not modify the parent’s info.
   */
  buildAxiosInfo?: (info: Readonly<IAxiosInfo>) => IAxiosInfo;
  children: JSX.Element[] | JSX.Element;
}

export default class AxiosProvider extends React.Component<IAxiosProviderProps> {
  public render() {
    const {
      buildAxiosInfo,
      children,
    } = this.props;
    return <Consumer>
    {parentValue => {
      const axiosInfo = buildAxiosInfo === undefined ? parentValue : buildAxiosInfo(parentValue);
      return <Provider value={axiosInfo}>
        {children}
      </Provider>;
    }}
    </Consumer>;
  }
}
