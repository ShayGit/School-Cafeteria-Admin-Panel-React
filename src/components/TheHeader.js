import { Layout, PageHeader } from "antd";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useContext } from "react";

import { Context as AuthContext } from "../context/AuthContext";

const { Header } = Layout;

const TheHeader = ({ onMenuClick, collapsed, title }) => {
  const {signout} = useContext(AuthContext);

  return (
    <Header className="site-layout-background" style={{ padding: 0}} >
        <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}> 
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: onMenuClick,
        style: {}
      })}
      <PageHeader
        className="site-page-header"
        title='מערכת ניהול אפליקציית קפיטריה'
        style={{}}
      />
      <div onClick={()=>signout()}>
          <LogoutOutlined className="trigger"  style={{fontSize: '20px'}} />
          </div>
        </span>
    </Header>
  );
};

export default TheHeader;
