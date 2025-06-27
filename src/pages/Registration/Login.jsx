import React, { useState, useContext } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Typography,
  message,
  theme,
  Select,
  Space,
  Modal
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, verifyOTP, registerAdmin} from '../../api/AuthApi';
import { AuthContext } from '../../Contexts/AuthContext';
import image from '../../asset/8636.jpg';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registerForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // ✅ LOGIN handler
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await apiLogin(values.email, values.password);
      localStorage.setItem('userEmail', values.email);
      login({
        Token: response.Token,
        roles: response.roles,
        email: values.email
      });
      message.success('Login successful!');
      navigate('/dashboard');
    } catch {
      message.error('Login failed: Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
const handleRegister = async (values) => {
  try {
    const result = await registerAdmin(values);
    if (result) {
      message.success(result.Message || 'Registered! OTP sent to your email.');
      setRegisteredEmail(values.email);
      setOtpVisible(true); // Show OTP modal
    }
  } catch (error) {
    message.error('Admin registration failed: ' + error.message);
  }
};


  // ✅ VERIFY OTP handler
  const handleVerifyOTP = async (otpValues) => {
    try {
      const result = await verifyOTP({
        email: registeredEmail,
        otp: otpValues.otp
      });
      if (result) {
        message.success('OTP verified successfully! Please log in.');
        setOtpVisible(false);
        setIsRegistering(false);
        registerForm.resetFields();
        otpForm.resetFields();
      } else {
        message.error('Invalid OTP');
      }
    } catch (error) {
      message.error('OTP verification failed: ' + error.message);
    }
  };

  // ✅ Registration form for Admin only
  const RegistrationForm = () => (
    <Form
      form={registerForm}
      name="register"
      onFinish={handleRegister}
      layout="vertical"
    >
      <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
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

      <Form.Item name="mobileNo" rules={[{ required: true, message: 'Please input your mobile number!' }]}>
        <Input placeholder="Mobile Number" size="large" />
      </Form.Item>

      <Form.Item name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
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
        initialValue="Admin"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item name="shopName" rules={[{ required: true, message: 'Please enter your shop name' }]}>
        <Input placeholder="Shop Name" size="large" />
      </Form.Item>

      <Form.Item name="shopLocation" rules={[{ required: true, message: 'Please enter shop location' }]}>
        <Input placeholder="Shop Location" size="large" />
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
        {/* Form Section */}
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
              <p>{isRegistering ? 'Create an account (Admin)' : 'Sign in to your account'}</p>
            </div>

            {isRegistering ? (
              <RegistrationForm />
            ) : (
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
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
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
            )}
          </Card>
        </div>

        {/* Image Section */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <img src={image} alt="Tailor Illustration" style={{ width: '80%', maxHeight: '500px', objectFit: 'contain' }} />
        </div>

        {/* OTP Modal */}
        <Modal
          title="OTP Verification"
          open={otpVisible}
          onCancel={() => setOtpVisible(false)}
          footer={null}
          destroyOnClose
        >
          <p>Enter the 6-digit OTP sent to:</p>
          <p style={{ fontWeight: 'bold' }}>{registeredEmail}</p>
          <Form form={otpForm} onFinish={handleVerifyOTP} layout="vertical">
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: 'Please enter OTP' },
                { len: 6, message: 'OTP must be 6 digits' }
              ]}
            >
              <Input prefix={<KeyOutlined />} placeholder="Enter OTP" maxLength={6} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Verify OTP
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Login;
