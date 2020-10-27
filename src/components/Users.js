import React, { useContext, useEffect } from 'react';
import { Space, Table, Tag } from 'antd';

import { Context as AuthContext } from "../context/AuthContext";

const { Column, ColumnGroup } = Table;

const Users =() =>{
   console.log('users useeffect')
    const {state: {users}, getUsers} = useContext(AuthContext)

useEffect(() => {
  if(users.length===0) 
  {
    getUsers();
  }
   
}, [])


  return (
   <div style={{flex: 1}}>
      <Table  dataSource={users} fluid scroll={{ x: 500 }} >
      <Column title="שם פרטי" dataIndex="firstName" key="firstName" align="center" width="100" />
      <Column title="שם משפחה" dataIndex="lastName" key="lastName" align="center" width="100"/>
      <Column title='דוא"ל' dataIndex="email" key="email" align="center" width="100"/>
      <Column title="מס' נייד" dataIndex="phoneNumber" key="phoneNumber" align="center" width="100"/>
      <Column title="עובד צוות" dataIndex="isStuff" key="isStuff" align="center" width="100" render={(isStuff) => isStuff? 'כן' : 'לא'}/>

    
    </Table>
   </div>
  );
}

export default Users;
