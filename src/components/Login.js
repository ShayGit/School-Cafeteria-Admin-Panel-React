import "./Login.css";

import { Button, Card, Form, Input } from "antd";
import React, { useContext, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";

import { Context as AuthContext } from "../context/AuthContext";

const Login =() =>{
  
  let location = useLocation();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    state: { isLoggedIn, errorMessage },
    signin,
  } = useContext(AuthContext);

  let { from } = location.state || { from: { pathname: "/" } };
     
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };


  if (isLoggedIn) {
    return <Redirect to={from} />
    
  }

  return (
    <div className="login_container">
      <Card
        title="התחבר למשתמש מנהל"
        style={{ border: "1px solid", width: 400}}
      >
        
          <Form
            {...layout}
            name="basic"
          >  
          <div>
            <Form.Item
              label="דואר אלקטרוני"
              name="email"
              rules={[{ required: true, message: 'דוא"ל לא הוזן' }]}
            >
              <Input
                type="email"
                size="large"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="דואר אלקטרוני"
              />
              
            </Form.Item>
            </div>
            <div>
            <Form.Item
              label="סיסמה"
              name="password"
              rules={[{ required: true, message: "נא הכנס סיסמה" }]}
            >
              
              <Input.Password
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="סיסמה"
              />
            </Form.Item>
            </div>
            <Form.Item {...tailLayout}>
              <div>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => signin({ email, password })}
              >
                התחבר
              </Button>
              </div>
            </Form.Item>
          </Form>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </Card>
    </div>
  );
}

export default Login;
