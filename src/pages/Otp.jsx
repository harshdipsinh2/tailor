import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Layout, Typography, message, Space } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../api/AuthApi';
import Image from '../asset/20945597.jpg';

const { Title } = Typography;
const { Content } = Layout;

const Otp = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const userEmail = location.state?.email || localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) {
      message.error('No email found. Please login again.');
      navigate('/login');
    }
  }, [userEmail, navigate]);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await sendOTP(userEmail);
      setOtpSent(true);
      message.success('OTP sent successfully!');
    } catch (error) {
      message.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values) => {
    setLoading(true);
    try {
      const verificationData = {
        email: userEmail,
        otp: values.otp
      };
      
      const result = await verifyOTP(verificationData);
      if (result) {
        message.success('OTP verified successfully!');
        navigate('/dashboard');
      } else {
        message.error('Invalid OTP');
      }
    } catch (error) {
      message.error(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

return (
  <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
    <Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      
      {/* Left side: OTP form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            margin: '2rem'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={3}>Email Verification</Title>
            <p>{otpSent ? 'Enter the OTP sent to your email' : 'Click below to receive OTP'}</p>
            <p style={{ fontWeight: 'bold' }}>{userEmail}</p>
          </div>

          {!otpSent ? (
            <Button
              type="primary"
              onClick={handleSendOTP}
              loading={loading}
              block
              size="large"
            >
              Send OTP
            </Button>
          ) : (
            <Form
              form={form}
              onFinish={handleVerifyOTP}
              layout="vertical"
            >
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please input the OTP!' },
                  { len: 6, message: 'OTP must be 6 digits!' }
                ]}
              >
                <Input
                  prefix={<KeyOutlined />}
                  placeholder="Enter 6-digit OTP"
                  size="large"
                  maxLength={6}
                />
              </Form.Item>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Verify OTP
                </Button>
                <Button
                  type="link"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </Space>
            </Form>
          )}
        </Card>
      </div>

      {/* Right side: Image */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <img src={Image} alt="OTP Illustration" style={{ width: '80%', maxHeight: '500px', objectFit: 'contain' }} />
      </div>

    </Content>
  </Layout>
);

};

export default Otp;