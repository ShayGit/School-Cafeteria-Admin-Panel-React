import './index.css';

import * as serviceWorker from './serviceWorker';

import App from './App';
import {Provider as AuthProvider} from './context/AuthContext'
import {Provider as OrdersProvider} from './context/OrdersContext'
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <AuthProvider>
      <OrdersProvider>
    <App />
    </OrdersProvider>
    </AuthProvider>,
  document.getElementById('root')
);

document.getElementsByTagName('html')[0].setAttribute("dir", "rtl");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
