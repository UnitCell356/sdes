//  解密表单组件
import React from 'react';
import { Card, Form, Input, Button, Radio, Alert } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';
import { decrypt8bit, decryptAscii } from '../../service/Alogrithm';

const DecryptionCard = ({ onDecryptResult, decryptResult }) => {
  const [form] = Form.useForm();

  const handleDecrypt = (values) => {
    const { inputType, ciphertext, key } = values;

    if (inputType === 'binary') {
      if (ciphertext.length !== 8 || key.length !== 10) return;
      onDecryptResult(decrypt8bit(ciphertext, key));
    } else {
      if (!ciphertext || key.length !== 10) return;
      onDecryptResult(decryptAscii(ciphertext, key));
    }
  };

  return (
    <Card
      className="card-base"
      title={
        <div className="card-title">
          <UnlockOutlined className="card-title-icon" />
          <span>解密(●⁰౪⁰●)</span>
        </div>
      }
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleDecrypt}
      >
        <Form.Item
          label="输入类型"
          name="inputType"
          initialValue="binary"
        >
          <Radio.Group>
            <Radio value="binary">二进制 (8位)</Radio>
            <Radio value="ascii">ASCII字符串</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="密文"
          name="ciphertext"
          rules={[
            { required: true, message: '请输入密文' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('inputType') === 'binary' && value && value.length !== 8) {
                  return Promise.reject(new Error('请输入8位二进制数'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            placeholder={form.getFieldValue('inputType') === 'binary' ? '例如: 01010101' : '例如: 乱码字符串'}
          />
        </Form.Item>

        <Form.Item
          label="密钥 (10位二进制)"
          name="key"
          rules={[
            { required: true, message: '请输入密钥' },
            { len: 10, message: '密钥必须为10位二进制数' },
            { pattern: /^[01]+$/, message: '密钥只能包含0和1' }
          ]}
        >
          <Input placeholder="例如: 1010000010" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<UnlockOutlined />}>
            解密
          </Button>
        </Form.Item>
      </Form>

      {decryptResult && (
        <div className="result-container">
          <Alert
            message="解密结果"
            description={
              form.getFieldValue('inputType') === 'binary'
                ? decryptResult
                : `明文: ${decryptResult}`
            }
            type="info"
            showIcon
          />
        </div>
      )}
    </Card>
  );
};

export default DecryptionCard;

// import React, { useState } from 'react';
// import { decrypt8bit, decryptAscii } from '../service/Alogrithm';

// const DecryptionForm = () => {
//   const [inputType, setInputType] = useState('binary');
//   const [ciphertext, setCiphertext] = useState('');
//   const [key, setKey] = useState('');
//   const [plaintext, setPlaintext] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (inputType === 'binary') {
//       if (ciphertext.length !== 8 || key.length !== 10) {
//         alert('请输入8位密文和10位密钥');
//         return;
//       }
//       setPlaintext(decrypt8bit(ciphertext, key));
//     } else {
//       if (!ciphertext || key.length !== 10) {
//         alert('请输入密文和10位密钥');
//         return;
//       }
//       setPlaintext(decryptAscii(ciphertext, key));
//     }
//   };

//   return (
//     <div className="card mb-4">
//       <div className="card-header bg-success text-white">
//         <h3>解密</h3>
//       </div>
//       <div className="card-body">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">输入类型:</label>
//             <div className="form-check">
//               <input
//                 type="radio"
//                 className="form-check-input"
//                 id="binaryInputDec"
//                 checked={inputType === 'binary'}
//                 onChange={() => setInputType('binary')}
//               />
//               <label className="form-check-label" htmlFor="binaryInputDec">
//                 二进制 (8位)
//               </label>
//             </div>
//             <div className="form-check">
//               <input
//                 type="radio"
//                 className="form-check-input"
//                 id="asciiInputDec"
//                 checked={inputType === 'ascii'}
//                 onChange={() => setInputType('ascii')}
//               />
//               <label className="form-check-label" htmlFor="asciiInputDec">
//                 ASCII字符串
//               </label>
//             </div>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">
//               {inputType === 'binary' ? '密文 (8位二进制):' : '密文 (ASCII字符串):'}
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               value={ciphertext}
//               onChange={(e) => setCiphertext(e.target.value)}
//               placeholder={inputType === 'binary' ? '例如: 10101010' : '例如: 乱码字符串'}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">密钥 (10位二进制):</label>
//             <input
//               type="text"
//               className="form-control"
//               value={key}
//               onChange={(e) => setKey(e.target.value)}
//               placeholder="例如: 1010000010"
//             />
//           </div>

//           <button type="submit" className="btn btn-success">解密</button>
//         </form>

//         {plaintext && (
//           <div className="mt-4">
//             <h5>解密结果:</h5>
//             <div className="alert alert-info">
//               {inputType === 'binary' ? plaintext : `明文: ${plaintext}`}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DecryptionForm;