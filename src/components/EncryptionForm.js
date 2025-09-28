// 加密表单组件

import React, { useState } from 'react';
import { encrypt8bit, encryptAscii } from '../service/Alogrithm';

const EncryptionForm = ({ onEncrypt }) => {
  const [inputType, setInputType] = useState('binary');
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputType === 'binary') {
      if (plaintext.length !== 8 || key.length !== 10) {
        alert('请输入8位明文和10位密钥');
        return;
      }
      setCiphertext(encrypt8bit(plaintext, key));
      onEncrypt && onEncrypt(plaintext, key, encrypt8bit(plaintext, key));
    } else {
      if (!plaintext || key.length !== 10) {
        alert('请输入明文和10位密钥');
        return;
      }
      setCiphertext(encryptAscii(plaintext, key));
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h3>加密</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">输入类型:</label>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="binaryInput"
                checked={inputType === 'binary'}
                onChange={() => setInputType('binary')}
              />
              <label className="form-check-label" htmlFor="binaryInput">
                二进制 (8位)
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="asciiInput"
                checked={inputType === 'ascii'}
                onChange={() => setInputType('ascii')}
              />
              <label className="form-check-label" htmlFor="asciiInput">
                ASCII字符串
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              {inputType === 'binary' ? '明文 (8位二进制):' : '明文 (ASCII字符串):'}
            </label>
            <input
              type="text"
              className="form-control"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder={inputType === 'binary' ? '例如: 10101010' : '例如: Hello'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">密钥 (10位二进制):</label>
            <input
              type="text"
              className="form-control"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="例如: 1010000010"
            />
          </div>

          <button type="submit" className="btn btn-primary">加密</button>
        </form>

        {ciphertext && (
          <div className="mt-4">
            <h5>加密结果:</h5>
            <div className="alert alert-success">
              {inputType === 'binary' ? ciphertext : `密文: ${ciphertext}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptionForm;