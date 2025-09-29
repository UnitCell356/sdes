import React from 'react';
import { Layout, Row, Col } from 'antd';
import { LockOutlined, UnlockOutlined, BulbOutlined, SafetyOutlined } from '@ant-design/icons';
import EncryptionCard from './components/EncryptionCard';
import DecryptionCard from './components/DecryptionCard';
import BruteForceCard from './components/BruteForceCard';
import AlgorithmInfoCard from './components/AlgorithmInfoCard';
import './styles/common.css';
import './styles/layout.css';
import './index.css';

const { Header, Content } = Layout;

const SDESView = () => {
  const [encryptResult, setEncryptResult] = React.useState('');
  const [decryptResult, setDecryptResult] = React.useState('');
  const [bruteForceResult, setBruteForceResult] = React.useState({
    keys: [],
    time: 0,
    progress: 0,
    running: false
  });

  return (
    <Layout className="sdes-layout">
      <Header className="sdes-header">
        <div className="header-content">
          <SafetyOutlined className="header-icon" />
          <h1 className="header-title">你为什么不来试试S-DES算法的加密解密呢( ´･ω)</h1>
        </div>
      </Header>

      <Content className="sdes-content">
        <div className="container">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <EncryptionCard
                onEncryptResult={setEncryptResult}
                encryptResult={encryptResult}
              />
            </Col>

            <Col xs={24} lg={12}>
              <DecryptionCard
                onDecryptResult={setDecryptResult}
                decryptResult={decryptResult}
              />
            </Col>

            <Col xs={24}>
              <BruteForceCard
                onBruteForceResult={setBruteForceResult}
                bruteForceResult={bruteForceResult}
              />
            </Col>

            <Col xs={24}>
              <AlgorithmInfoCard />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default SDESView;