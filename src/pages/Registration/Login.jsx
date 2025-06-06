import React, { useState, useContext } from 'react';
import { Button, Card, Form, Input, Layout, Typography, message, theme, Select, Space } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../api/AuthApi';
import { AuthContext } from '../../Contexts/AuthContext';
import { registerUser } from '../../api/UserApi';
import image from '../../asset/8636.jpg';


const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerForm] = Form.useForm();
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

  // Add registration handler
  const handleRegister = async (values) => {
    try {
      const result = await registerUser(values);
      if (result) {
        message.success('Registration successful! Please login to continue.');
        setIsRegistering(false);
        registerForm.resetFields();
      }
    } catch (error) {
      message.error("Registration failed: " + error.message);
    }
  };

  const RegistrationForm = () => (
    <Form
      form={registerForm}
      name="register"
      onFinish={handleRegister}
      layout="vertical"
    >
      <Form.Item 
        name="name" 
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input placeholder="Full Name" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item
        name="mobileNo"
        rules={[{ required: true, message: 'Please input your mobile number!' }]}
      >
        <Input placeholder="Mobile Number" size="large" />
      </Form.Item>

      <Form.Item
        name="address"
        rules={[{ required: true, message: 'Please input your address!' }]}
      >
        <Input.TextArea placeholder="Address" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
      </Form.Item>

      <Form.Item
        name="roleName"
        rules={[{ required: true, message: 'Please select a role!' }]}
      >
        <Select placeholder="Select Role">
          <Select.Option value="Manager">Admin</Select.Option>
          <Select.Option value="Manager">Manager</Select.Option>
          <Select.Option value="Tailor">Tailor</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" size="large">
            Register
          </Button>
          <Button onClick={() => setIsRegistering(false)} size="large">
            Back to Login
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        
        {/* Left side: login/register form */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            style={{
              width: '100%',
              maxWidth: '420px',
              borderRadius: borderRadiusLG,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              margin: '2rem'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3}>Tailor Management System</Title>
              <p>{isRegistering ? 'Create an account' : 'Sign in to your account'}</p>
            </div>

            {isRegistering ? (
              <RegistrationForm />
            ) : (
              <>
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

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Button type="link" onClick={() => setIsRegistering(true)}>
                      Don't have an account? Sign up
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Card>
        </div>

        {/* Right side: image */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <img src={image} alt="Tailor Illustration" style={{ width: '80%', maxHeight: '500px', objectFit: 'contain' }} />
        </div>
        
      </Content>
    </Layout>
  );
};

export default Login;
