// 暴力破解组件

import React, { useState } from 'react';
import { bruteForceKey } from '../service/Alogrithm';

const BruteForceForm = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [foundKeys, setFoundKeys] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (plaintext.length !== 8 || ciphertext.length !== 8) {
      alert('请输入8位明文和8位密文');
      return;
    }

    setIsRunning(true);
    setFoundKeys([]);
    setProgress(0);

    const startTime = performance.now();

    const keys = await new Promise(resolve => {
      const keysFound = bruteForceKey(plaintext, ciphertext, (p) => {
        setProgress(p);
      });
      resolve(keysFound);
    });

    const endTime = performance.now();
    setTimeTaken(endTime - startTime);
    setFoundKeys(keys);
    setIsRunning(false);
  };

  return (
    <div className="card">
      <div className="card-header bg-warning text-dark">
        <h3>暴力破解</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">明文 (8位二进制):</label>
            <input
              type="text"
              className="form-control"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="例如: 10101010"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">密文 (8位二进制):</label>
            <input
              type="text"
              className="form-control"
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder="例如: 01010101"
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning"
            disabled={isRunning}
          >
            {isRunning ? '破解中...' : '开始暴力破解'}
          </button>
        </form>

        {isRunning && (
          <div className="mt-4">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        )}

        {foundKeys.length > 0 && (
          <div className="mt-4">
            <h5>破解结果:</h5>
            <div className="alert alert-warning">
              <p>耗时: {timeTaken.toFixed(2)} 毫秒</p>
              <p>找到 {foundKeys.length} 个可能的密钥:</p>
              <ul>
                {foundKeys.map((key, index) => (
                  <li key={index}>{key}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BruteForceForm;