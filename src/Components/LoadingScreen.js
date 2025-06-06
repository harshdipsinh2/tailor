import React from 'react';
import { motion } from 'framer-motion';
import { ScissorOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import '../Css/LoadingScreen.css';

const { Text } = Typography;

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="loading-icon"
      >
        <ScissorOutlined />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="loading-text"
      >
        <Text>Preparing your tailoring workspace...</Text>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;