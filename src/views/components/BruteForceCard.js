// 暴力破解组件
import React from 'react';
import { Card, Form, Input, Button, Progress, Alert, Space, Tag, Row, Col } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { bruteForceKey } from '../../service/Alogrithm';

const BruteForceCard = ({ onBruteForceResult, bruteForceResult }) => {
  const [form] = Form.useForm();

  const handleBruteForce = async (values) => {
    const { plaintext, ciphertext } = values;

    if (plaintext.length !== 8 || ciphertext.length !== 8) return;

    onBruteForceResult({
      keys: [],
      time: 0,
      progress: 0,
      running: true
    });

    const startTime = performance.now();

    const keys = await new Promise(resolve => {
      const keysFound = bruteForceKey(plaintext, ciphertext, (progress) => {
        onBruteForceResult(prev => ({
          ...prev,
          progress
        }));
      });
      resolve(keysFound);
    });

    const endTime = performance.now();

    onBruteForceResult({
      keys,
      time: endTime - startTime,
      progress: 100,
      running: false
    });
  };

  return (
    <Card
      className="card-base"
      title={
        <div className="card-title">
          <BulbOutlined className="card-title-icon" />
          <span>暴力破解<i>-让我来好好教训教训你(๑•ૅω•´๑)</i></span>
        </div>
      }
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleBruteForce}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="明文 (8位二进制)"
              name="plaintext"
              rules={[
                { required: true, message: '请输入明文' },
                { len: 8, message: '明文必须为8位二进制数' },
                { pattern: /^[01]+$/, message: '明文只能包含0和1' }
              ]}
            >
              <Input placeholder="例如: 10101010" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="密文 (8位二进制)"
              name="ciphertext"
              rules={[
                { required: true, message: '请输入密文' },
                { len: 8, message: '密文必须为8位二进制数' },
                { pattern: /^[01]+$/, message: '密文只能包含0和1' }
              ]}
            >
              <Input placeholder="例如: 01010101" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<BulbOutlined />}
            loading={bruteForceResult.running}
          >
            {bruteForceResult.running ? '破解中...' : '开始暴力破解'}
          </Button>
        </Form.Item>
      </Form>

      {bruteForceResult.running && (
        <div className="progress-container">
          <Progress percent={bruteForceResult.progress} status="active" />
        </div>
      )}

      {bruteForceResult.keys.length > 0 && (
        <div className="result-container">
          <Alert
            message="破解结果"
            description={
              <div>
                <p>耗时: {bruteForceResult.time.toFixed(2)} 毫秒</p>
                <p>找到 {bruteForceResult.keys.length} 个可能的密钥:</p>
                <Space wrap>
                  {bruteForceResult.keys.map((key, index) => (
                    <Tag className="result-tag" color="blue" key={index}>{key}</Tag>
                  ))}
                </Space>
              </div>
            }
            type="warning"
            showIcon
          />
        </div>
      )}
    </Card>
  );
};

export default BruteForceCard;
