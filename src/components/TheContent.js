import { Redirect, BrowserRouter as Router, Switch } from "react-router-dom";

import Catalog from './Catalog';
import { Layout } from 'antd';
import Orders from './Orders';
import PrivateRoute from './PrivateRoute';
import React from 'react';
import Users from './Users';

const {Content} = Layout;

const TheContent =(props) =>{
 
  return (
    <Content
    className="site-layout-background"
    style={{
      display: 'flex',
       flex: 1,
        margin: '24px 16px',
        padding: 24,
        minHeight: 500
      }}
  >
     <Switch>
        <PrivateRoute  exact name= "Orders" path="/orders">
         <Orders {...props}/>
        </PrivateRoute>
        <PrivateRoute  exact name= "Users" path="/users">
        <Users {...props}/>
        </PrivateRoute>
        <PrivateRoute  exact name= "Catalog" path="/catalog">
        <Catalog {...props}/>
        </PrivateRoute>
        <Redirect from ='/' to='/orders'/>
          </Switch>
  </Content>
  );
}

export default TheContent;
