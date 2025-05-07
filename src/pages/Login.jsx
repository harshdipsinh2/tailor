import React, { useState, useContext } from 'react';
import { Button, Card, Form, Input, Layout, Typography, message, theme } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/AuthApi';
import { AuthContext } from '../Contexts/AuthContext';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await apiLogin(values.email, values.password);
      
      // Store both token and email
      localStorage.setItem('userEmail', values.email);
      
      // Update auth context
      login({
        Token: response.Token,
        roles: response.roles,
        email: values.email // Add email to auth context
      });

      message.success('Login successful! Please verify with OTP');
      navigate('/otp', { state: { email: values.email } }); // Pass email through navigation state
    } catch (error) {
      message.error('Login failed: Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: borderRadiusLG,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={3}>Tailor Management System</Title>
            <p>Sign in to your account</p>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Sign In
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
