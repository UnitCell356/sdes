import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const AlgorithmInfoCard = () => {
  return (
    <Card
      className="card-base"
      title="你学会了吗ξ( ✿＞◡❛)"
      bordered={false}
    >
      <Paragraph>
        S-DES (Simplified Data Encryption Standard) 是一个教学用简化版DES算法，
        使用8位分组和10位密钥，包含初始置换、轮函数、S盒替换和最终置换等步骤。
      </Paragraph>
      <Paragraph>
        <Text strong>算法特点:</Text>
        <ul>
          <li>分组长度: 8-bit</li>
          <li>密钥长度: 10-bit</li>
          <li>加密算法: C=IP⁻¹(fₖ₂(SW(fₖ₁(IP(P)))))</li>
          <li>解密算法: P=IP⁻¹(fₖ₁(SW(fₖ₂(IP(C)))))</li>
        </ul>
      </Paragraph>
    </Card>
  );
};

export default AlgorithmInfoCard;