import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { fadeIn, zoomIn, slideInUp } from 'react-animations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUserTie, 
  faMoneyBillWave, 
  faRuler, 
  faCalendarAlt,
  faCogs,
  faBullseye,
  faMobileAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

// Animations
const fadeInAnimation = keyframes`${fadeIn}`;
const zoomInAnimation = keyframes`${zoomIn}`;
const slideInUpAnimation = keyframes`${slideInUp}`;

// Styled components
const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  width: 100%;
  padding: 2rem;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  animation: 1s ${fadeInAnimation};
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    color: #3498db;
  }
`;

const GetStartedButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: 1s ${fadeInAnimation};
  
  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 5;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  animation: 1s ${zoomInAnimation};
  line-height: 1.2;
  
  span {
    color: #3498db;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  max-width: 800px;
  line-height: 1.6;
  animation: 1s ${fadeInAnimation};
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 3rem 0;
  animation: 1s ${fadeInAnimation};
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 280px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
`;

const FeatureDescription = styled.p`
  color: #7f8c8d;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 4rem 0;
  width: 100%;
  animation: 1s ${fadeInAnimation};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
`;

const TestimonialSection = styled.section`
  background: rgba(255, 255, 255, 0.8);
  padding: 3rem;
  border-radius: 15px;
  margin: 3rem 0;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: 1s ${fadeInAnimation};
`;

const TestimonialText = styled.blockquote`
  font-size: 1.2rem;
  color: #2c3e50;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: #3498db;
`;

const CtaSection = styled.div`
  text-align: center;
  margin: 4rem 0;
  animation: 1s ${slideInUpAnimation};
`;

const CtaTitle = styled.h2`
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const CtaButton = styled(GetStartedButton)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
`;

const BackgroundShape = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(52, 152, 219, 0.1);
  top: -300px;
  right: -300px;
  z-index: 1;
`;

const BackgroundShape2 = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(52, 152, 219, 0.05);
  bottom: -200px;
  left: -200px;
  z-index: 1;
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <HomeContainer>
      <BackgroundShape />
      <BackgroundShape2 />
      
      <Header>
        <Logo>Tailor<span>Pro</span></Logo>
        <GetStartedButton onClick={handleGetStarted}>Get Started</GetStartedButton>
      </Header>
      
      <MainContent>
        <Title>Revolutionize Your <span>Tailoring Business</span></Title>
        <Subtitle>
          The most comprehensive solution for tailors to manage orders, customers, 
          and business operations with unmatched efficiency and precision.
        </Subtitle>
        
        <FeaturesContainer>
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faChartLine} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Real-time Analytics</FeatureTitle>
            <FeatureDescription>
              Monitor your business performance with intuitive dashboards and detailed reports.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faUserTie} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Customer Profiles</FeatureTitle>
            <FeatureDescription>
              Store detailed customer information including measurements, preferences, and order history.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faRuler} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Measurement Tracking</FeatureTitle>
            <FeatureDescription>
              Never lose a measurement again with our digital measurement storage system.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>

        <FeaturesContainer>
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faMoneyBillWave} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Financial Management</FeatureTitle>
            <FeatureDescription>
              Generate invoices, track payments, and manage expenses all in one place.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Appointment Scheduling</FeatureTitle>
            <FeatureDescription>
              Let customers book appointments online and manage your schedule effortlessly.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faCogs} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Workflow Automation</FeatureTitle>
            <FeatureDescription>
              Automate repetitive tasks and focus on what you do best - tailoring.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>

        <StatsContainer>
          <StatItem>
            <StatNumber>500+</StatNumber>
            <StatLabel>Tailors Trust Us</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>95%</StatNumber>
            <StatLabel>Customer Satisfaction</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>3x</StatNumber>
            <StatLabel>Faster Operations</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support Available</StatLabel>
          </StatItem>
        </StatsContainer>

        <TestimonialSection>
          <TestimonialText>
            "TailorPro has transformed my business. I've reduced order processing time by 60% and my customers love the professional invoices and reminders. The measurement tracking feature alone is worth the price!"
          </TestimonialText>
          <TestimonialAuthor>- Rajesh Kumar, Master Tailor</TestimonialAuthor>
        </TestimonialSection>

        <FeaturesContainer>
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faBullseye} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Precision Tools</FeatureTitle>
            <FeatureDescription>
              Advanced tools to ensure every stitch is perfect and every measurement is accurate.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faMobileAlt} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Mobile Friendly</FeatureTitle>
            <FeatureDescription>
              Access your business data anywhere, anytime with our responsive mobile interface.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FontAwesomeIcon icon={faShieldAlt} size="lg" />
            </FeatureIcon>
            <FeatureTitle>Data Security</FeatureTitle>
            <FeatureDescription>
              Your business data is protected with enterprise-grade security measures.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>

        <CtaSection>
          <CtaTitle>Ready to Transform Your Tailoring Business?</CtaTitle>
          <CtaButton onClick={handleGetStarted}>Start Free Trial</CtaButton>
        </CtaSection>
      </MainContent>
    </HomeContainer>
  );
};

export default HomePage;