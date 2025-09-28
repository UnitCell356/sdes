// 解密表单组件

import React, { useState } from 'react';
import { decrypt8bit, decryptAscii } from '../service/Alogrithm';

const DecryptionForm = () => {
  const [inputType, setInputType] = useState('binary');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('');
  const [plaintext, setPlaintext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputType === 'binary') {
      if (ciphertext.length !== 8 || key.length !== 10) {
        alert('请输入8位密文和10位密钥');
        return;
      }
      setPlaintext(decrypt8bit(ciphertext, key));
    } else {
      if (!ciphertext || key.length !== 10) {
        alert('请输入密文和10位密钥');
        return;
      }
      setPlaintext(decryptAscii(ciphertext, key));
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-success text-white">
        <h3>解密</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">输入类型:</label>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="binaryInputDec"
                checked={inputType === 'binary'}
                onChange={() => setInputType('binary')}
              />
              <label className="form-check-label" htmlFor="binaryInputDec">
                二进制 (8位)
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="asciiInputDec"
                checked={inputType === 'ascii'}
                onChange={() => setInputType('ascii')}
              />
              <label className="form-check-label" htmlFor="asciiInputDec">
                ASCII字符串
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              {inputType === 'binary' ? '密文 (8位二进制):' : '密文 (ASCII字符串):'}
            </label>
            <input
              type="text"
              className="form-control"
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder={inputType === 'binary' ? '例如: 10101010' : '例如: 乱码字符串'}
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

          <button type="submit" className="btn btn-success">解密</button>
        </form>

        {plaintext && (
          <div className="mt-4">
            <h5>解密结果:</h5>
            <div className="alert alert-info">
              {inputType === 'binary' ? plaintext : `明文: ${plaintext}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecryptionForm;