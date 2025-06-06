import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { RocketOutlined, SafetyOutlined, StarOutlined, TrophyOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../../Css/HomePage.css'; // Create this CSS file for custom styles
import image from "../../asset/maschine.jpeg";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const Homepage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <UserOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Customer Management',
      description: 'Store and manage customer profiles with detailed measurements, order history, and preferences.'
    },
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Order Processing',
      description: 'Manage orders from creation to delivery with real-time updates.'
    },
    {
      icon: <StarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Product Management',
      description: 'Organize your clothing designs with sizes, styles, and pricing.'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Fabric Inventory',
      description: 'Track fabric stock levels, types, and colors with smart alerts.'
    }
  ];

  const highlights = [
    {
      title: 'Comprehensive Order Management',
      description: 'Complete lifecycle management from measurements to delivery.'
    },
    {
      title: 'Multi-role Access Control',
      description: 'Secure role-based access for different team members.'
    },
    {
      title: 'Integrated Communications',
      description: 'Built-in SMS system for notifications and reminders.'
    }
  ];

  const securityFeatures = [
    {
      title: 'OTP Verification',
      description: 'Secure login with one-time passwords'
    },
    {
      title: 'Data Encryption',
      description: 'All your data encrypted at rest and in transit'
    },
    {
      title: 'Role-based Access',
      description: 'Control who sees what in your system'
    }
  ];

  return (
    <Layout className="layout">
      <Header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <img 
              src={image} 
              alt="Tailor Logo" 
              style={{ 
                height: '40px', 
                width: '40px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }} 
            />
            <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '24px' }}>
              Tailor Management System ✃
            </span>
          </motion.div>
        </div>
        <Menu theme="light" mode="horizontal" className="menu">
          <Menu.Item key="features" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
            Features
          </Menu.Item>
          <Menu.Item key="highlights" onClick={() => document.getElementById('highlights').scrollIntoView({ behavior: 'smooth' })}>
            Highlights
          </Menu.Item>
          <Menu.Item key="security" onClick={() => document.getElementById('security').scrollIntoView({ behavior: 'smooth' })}>
            Security
          </Menu.Item>
          <Menu.Item key="getStarted">
            <Button 
              type="primary" 
              onClick={() => navigate('/login')}
              style={{ 
                borderRadius: '20px',
                padding: '0 24px'
              }}
            >
              Get Started
            </Button>
          </Menu.Item>
        </Menu>
      </Header>

      <Content className="site-layout">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <Title level={1} className="hero-title">
              Streamline Your Tailoring Business
            </Title>
            <Paragraph className="hero-description">
              An all-in-one management solution designed specifically for tailoring businesses. 
              Manage customers, orders, fabrics, and employees with ease.
            </Paragraph>
            <Space size="large">
     
            </Space>
            <div className="trust-badge">
              <Text type="secondary">500+ tailoring businesses trust us</Text>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="section">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Title level={2} className="section-title">
              Comprehensive Features
            </Title>
            <Paragraph className="section-description">
              Everything you need to manage your tailoring business efficiently
            </Paragraph>
            <Row gutter={[24, 24]} justify="center">
              {features.map((feature, index) => (
                <Col xs={24} sm={12} md={12} lg={6} key={index}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <Title level={4}>{feature.title}</Title>
                      <Paragraph>{feature.description}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Highlights Section */}
        <section id="highlights" className="section highlight-section">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Title level={2} className="section-title">
              Powerful System Highlights
            </Title>
            <Paragraph className="section-description">
              What makes TailorMaster stand out from the competition
            </Paragraph>
            <Row gutter={[24, 24]} justify="center">
              {highlights.map((highlight, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="highlight-card">
                      <Title level={4}>{highlight.title}</Title>
                      <Paragraph>{highlight.description}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Security Section */}
        <section id="security" className="section security-section">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Title level={2} className="section-title">
              Your Data is Secure with Us
            </Title>
            <Paragraph className="section-description">
              We prioritize the security of your business data with industry-leading protection
            </Paragraph>
            <Row gutter={[24, 24]} justify="center">
              {securityFeatures.map((feature, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card className="security-card">
                      <SafetyOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                      <Title level={4}>{feature.title}</Title>
                      <Paragraph>{feature.description}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>
      </Content>
    </Layout>
  );
};

export default Homepage;