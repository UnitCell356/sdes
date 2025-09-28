
import React from 'react';
import EncryptionForm from '../components/EncryptionForm';
import DecryptionForm from '../components/DecryptionForm';
import BruteForceForm from '../components/BruteForceForm';

const SDESDemo = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="text-center mb-4">
            <h1>S-DES 算法演示</h1>
            <p className="lead">简化数据加密标准算法实现</p>
          </div>

          <EncryptionForm />
          <DecryptionForm />
          <BruteForceForm />

          <div className="mt-4 text-center">
            <h4>算法说明</h4>
            <p className="text-muted">
              S-DES (Simplified Data Encryption Standard) 是一个教学用简化版DES算法，<br />
              使用8位分组和10位密钥，包含初始置换、轮函数、S盒替换和最终置换等步骤。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDESDemo;