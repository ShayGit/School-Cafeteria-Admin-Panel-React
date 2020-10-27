import { Layout, Menu } from "antd";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

import React from "react";

const { Sider } = Layout;

const TheSidebar = ({ collapsed }) => {
  const location = useLocation();
  
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["/orders"]} selectedKeys={[location.pathname]}>
        <Menu.Item key="/orders">
          <NavLink to="/orders"  activeClassName="selected">
            <span
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <UnorderedListOutlined />
              {!collapsed && <div className="menu-item">הזמנות</div>}
            </span>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="/users">
        <NavLink to="/users"  activeClassName="selected">
          <span
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <UserOutlined />
            {!collapsed && <div className="menu-item">משתמשים</div>}
          </span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/catalog">
        <NavLink to="/catalog"  activeClassName="selected">
          <span
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MenuOutlined />
            {!collapsed && <div className="menu-item">קטלוג</div>}
          </span>
          </NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default TheSidebar;
