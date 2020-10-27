import './Dashboard.css'

import React, { useContext, useEffect, useState } from 'react';
import {format, parse} from 'date-fns';

import { Layout } from 'antd';
import { Context as OrdersContext } from "../context/OrdersContext";
import TheContent from './TheContent';
import TheHeader from './TheHeader';
import TheSidebar from './TheSidebar';
import {firestore} from '../config/firebase'

const {Footer } = Layout;

const Dasboard =() =>{
  
    const {updateOrders, reset} = useContext(OrdersContext)

    const [collapsed,setCollapsed] = useState(false)
   
      const toggle = () => {
        setCollapsed(!collapsed)
      };

      useEffect(() => {
        let date =  format(new Date(),"dd/MM/yyyy");
        date = parse(date, "dd/MM/yyyy", new Date())
    
    
        const query = firestore
          .collection("orders")
          //.where("createdAt", ">", date);

        const observer = query.onSnapshot(
          (querySnapshot) => {
            console.log('onsnapshot')
            updateOrders(querySnapshot);
          },
          (err) => {
            console.log(`Encountered error: ${err}`);
          }
        );
          
        return () => {
          observer();
         // reset();
        }
      }, []);

  return (
    <Layout className="layout" >
    <TheSidebar collapsed={collapsed}/>  
    <Layout className="site-layout">
    <TheHeader onMenuClick={()=> toggle()}  collapsed={collapsed}/>
    <TheContent/>
    <Footer style={{ textAlign: 'center' }}>©2020 Shay Cohen, All rights reserved</Footer>
    </Layout>
  </Layout>
  );
}

export default Dasboard;
