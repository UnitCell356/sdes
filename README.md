# S-DES 算法的 React 实现

这个项目使用 React 框架实现了 **简化数据加密标准（Simplified Data Encryption Standard，S-DES）** 算法，支持**加密**、**解密**以及**暴力破解密钥**的功能。S-DES 是 DES 算法的简化教学版本，采用 8 位数据块和 10 位密钥进行操作。


## ✨ 功能特点

- **加密**：对 8 位二进制数据或 ASCII 字符串，使用 10 位二进制密钥进行加密。
- **解密**：使用相同密钥，从密文中还原出原始数据。
- **暴力破解**：遍历所有可能的 10 位密钥，匹配给定的“明文-密文”对。
- **交互界面**：基于 Ant Design 构建，提供直观友好的操作体验。


## 📂 项目结构

项目对**算法逻辑**和**UI 组件**进行了模块化分离，结构清晰：

```
src/
├── service/          # S-DES 算法核心逻辑
│   ├── Algorithm.js  # 加密、解密、暴力破解的函数实现
│   ├── SDESUtils.js  # 工具函数（二进制转换、置换、异或等）
├── views/
│   ├── components/   # React UI 组件
│   │   ├── EncryptionCard.js  # 加密表单组件
│   │   ├── DecryptionCard.js  # 解密表单组件
│   │   ├── BruteForceCard.js  # 暴力破解组件
│   │   ├── AlgorithmInfoCard.js  # S-DES 算法介绍组件
│   ├── styles/       # CSS 样式文件
│   ├── index.js      # 组件组合入口
├── App.js            # 根组件
├── index.js          # 应用入口点
```


## 🧠 核心算法：S-DES

S-DES 基于**8 位数据块**和**10 位密钥**，流程包含**初始置换**、**轮函数（含 S 盒替换）**、**最终置换**等步骤。


### 关键工具与算法文件

#### 1. `service/SDESUtils.js`（工具函数）
提供二进制操作、置换、异或等基础能力：
```javascript
// 用置换表对二进制位进行置换
export const permute = (input, permutationTable) => 
  permutationTable.map(index => input[index - 1]).join('');

// 对两个二进制字符串执行异或操作
export const xor = (a, b) => 
  a.split('').map((bit, i) => bit === b[i] ? '0' : '1').join('');

// 二进制字符串转十进制
export const binToDec = (binStr) => parseInt(binStr, 2);

// 十进制转固定长度的二进制字符串
export const decToBin = (dec, length) => {
  const bin = dec.toString(2);
  return bin.padStart(length, '0');
};

// 循环左移操作
export const leftShift = (input, shiftCount) => {
  const arr = input.split('');
  for (let i = 0; i < shiftCount; i++) {
    arr.push(arr.shift());
  }
  return arr.join('');
};
```

#### 2. `service/Algorithm.js`（核心算法）
实现 S-DES 的密钥生成、加密、解密逻辑：
```javascript
import { permute, leftShift, xor, sBoxSubstitution, binToDec, decToBin } from './SDESUtils';

// S-DES 常量表（置换、S盒等）
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
const IP = [2, 6, 3, 1, 4, 8, 5, 7];
const IP_INV = [4, 1, 3, 5, 7, 2, 8, 6];
const EP = [4, 1, 2, 3, 2, 3, 4, 1];
const P4 = [2, 4, 3, 1];
const SBOX1 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 0, 2]
];
const SBOX2 = [
  [0, 1, 2, 3],
  [2, 3, 1, 0],
  [3, 0, 1, 2],
  [2, 1, 0, 3]
];

// 从 10 位密钥生成两个子密钥
export const generateSubKeys = (key) => {
  const p10Key = permute(key, P10);
  const [left1, right1] = [p10Key.slice(0, 5), p10Key.slice(5)];
  const left2 = leftShift(left1, 1);
  const right2 = leftShift(right1, 1);
  const left3 = leftShift(left2, 2);
  const right3 = leftShift(right2, 2);
  return {
    subKey1: permute(left2 + right2, P8),
    subKey2: permute(left3 + right3, P8)
  };
};

// 8 位二进制明文加密
export const encrypt8bit = (plaintext, key) => {
  const { subKey1, subKey2 } = generateSubKeys(key);
  const ipResult = permute(plaintext, IP);
  const [ipLeft, ipRight] = [ipResult.slice(0, 4), ipResult.slice(4)];
  const fk1Result = feistelFunction(ipRight, subKey1);
  const xor1 = xor(ipLeft, fk1Result);
  const swResult = xor1 + ipRight;
  const [swLeft, swRight] = [swResult.slice(0, 4), swResult.slice(4)];
  const fk2Result = feistelFunction(swRight, subKey2);
  const xor2 = xor(swLeft, fk2Result);
  return permute(xor2 + swRight, IP_INV);
};

// Feistel 轮函数（S-DES 核心轮逻辑）
const feistelFunction = (input, subKey) => {
  const epResult = permute(input, EP);
  const xorResult = xor(epResult, subKey);
  const [left, right] = [xorResult.slice(0, 4), xorResult.slice(4)];
  const s1Output = sBoxLookup(left, SBOX1);
  const s2Output = sBoxLookup(right, SBOX2);
  return permute(s1Output + s2Output, P4);
};

// S 盒查找
const sBoxLookup = (input, sBox) => {
  const row = binToDec(input[0] + input[3]);
  const col = binToDec(input[1] + input[2]);
  return decToBin(sBox[row][col], 2);
};

// ASCII 字符串加密（逐字符处理）
export const encryptAscii = (plaintext, key) => {
  return plaintext
    .split('')
    .map(char => decToBin(char.charCodeAt(0), 8))
    .map(bin => encrypt8bit(bin, key))
    .join(' ');
};

// 8 位二进制密文解密（与加密为对称过程，子密钥顺序交换）
export const decrypt8bit = (ciphertext, key) => {
  const { subKey1, subKey2 } = generateSubKeys(key);
  const ipResult = permute(ciphertext, IP);
  const [ipLeft, ipRight] = [ipResult.slice(0, 4), ipResult.slice(4)];
  const fk2Result = feistelFunction(ipRight, subKey2);
  const xor1 = xor(ipLeft, fk2Result);
  const swResult = xor1 + ipRight;
  const [swLeft, swRight] = [swResult.slice(0, 4), swResult.slice(4)];
  const fk1Result = feistelFunction(swRight, subKey1);
  const xor2 = xor(swLeft, fk1Result);
  return permute(xor2 + swRight, IP_INV);
};

// ASCII 字符串解密（逐字符还原）
export const decryptAscii = (ciphertext, key) => {
  return ciphertext
    .split(' ')
    .map(bin => decrypt8bit(bin, key))
    .map(bin => String.fromCharCode(binToDec(bin)))
    .join('');
};

// 暴力破解密钥（遍历所有 10 位二进制可能）
export const bruteForceKey = (plaintext, ciphertext, onProgress) => {
  const totalKeys = 1024; // 2^10
  let foundKeys = [];
  for (let i = 0; i < totalKeys; i++) {
    const key = decToBin(i, 10);
    const encrypted = encrypt8bit(plaintext, key);
    if (encrypted === ciphertext) {
      foundKeys.push(key);
    }
    // 每 10 个密钥更新一次进度（可选：用于 UI 展示）
    if (i % 10 === 0) {
      onProgress?.(Math.round((i / totalKeys) * 100));
    }
  }
  onProgress?.(100);
  return foundKeys;
};
```


## 🖥️ UI 组件介绍

### 1. `EncryptionCard.js`（加密组件）
处理加密逻辑，支持“二进制/ASCII”两种输入类型：
```javascript
import React from 'react';
import { Card, Form, Input, Button, Radio } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { encrypt8bit, encryptAscii } from '../../service/Algorithm';

const EncryptionCard = ({ onEncryptResult, encryptResult }) => {
  const [form] = Form.useForm();

  const handleEncrypt = (values) => {
    const { inputType, plaintext, key } = values;
    if (inputType === 'binary') {
      if (plaintext.length === 8 && key.length === 10) {
        onEncryptResult(encrypt8bit(plaintext, key));
      }
    } else {
      if (plaintext && key.length === 10) {
        onEncryptResult(encryptAscii(plaintext, key));
      }
    }
  };

  return (
    <Card 
      className="card-base" 
      title={
        <div className="card-title">
          <LockOutlined className="card-title-icon" />
          <span>现在，要开始加密了喔((〃'▽'〃))</span>
        </div>
      } 
      bordered={false}
    >
      <Form form={form} onFinish={handleEncrypt}>
        <Form.Item name="inputType" initialValue="binary">
          <Radio.Group>
            <Radio value="binary">二进制(8位)</Radio>
            <Radio value="ascii">ASCII字符串</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item 
          name="plaintext" 
          rules={[{ required: true, message: '请输入明文' }]}
        >
          <Input placeholder="例如: 11010101 或 Hello" />
        </Form.Item>
        <Form.Item 
          name="key" 
          rules={[{ required: true, message: '请输入10位二进制密钥' }]}
        >
          <Input placeholder="例如: 1000000000" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">加密</Button>
        </Form.Item>
      </Form>
      {encryptResult && (
        <div className="result-box success">
          <p>加密结果</p >
          <p>{encryptResult}</p >
        </div>
      )}
    </Card>
  );
};

export default EncryptionCard;
```

### 2. `DecryptionCard.js`（解密组件）
与加密逻辑对称，从密文中还原明文：
```javascript
import React from 'react';
import { Card, Form, Input, Button, Radio } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';
import { decrypt8bit, decryptAscii } from '../../service/Algorithm';

const DecryptionCard = ({ onDecryptResult, decryptResult }) => {
  const [form] = Form.useForm();

  const handleDecrypt = (values) => {
    const { inputType, ciphertext, key } = values;
    if (inputType === 'binary') {
      if (ciphertext.length === 8 && key.length === 10) {
        onDecryptResult(decrypt8bit(ciphertext, key));
      }
    } else {
      if (ciphertext && key.length === 10) {
        onDecryptResult(decryptAscii(ciphertext, key));
      }
    }
  };

  return (
    <Card 
      className="card-base" 
      title={
        <div className="card-title">
          <UnlockOutlined className="card-title-icon" />
          <span>解密(๑•̀ㅂ•́)و✧</span>
        </div>
      } 
      bordered={false}
    >
      <Form form={form} onFinish={handleDecrypt}>
        <Form.Item name="inputType" initialValue="binary">
          <Radio.Group>
            <Radio value="binary">二进制(8位)</Radio>
            <Radio value="ascii">ASCII字符串</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item 
          name="ciphertext" 
          rules={[{ required: true, message: '请输入密文' }]}
        >
          <Input placeholder="例如: 乱码字符串 或 11001101" />
        </Form.Item>
        <Form.Item 
          name="key" 
          rules={[{ required: true, message: '请输入10位二进制密钥' }]}
        >
          <Input placeholder="例如: 1000000000" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">解密</Button>
        </Form.Item>
      </Form>
      {decryptResult && (
        <div className="result-box info">
          <p>解密结果</p >
          <p>{decryptResult}</p >
        </div>
      )}
    </Card>
  );
};

export default DecryptionCard;
```

### 3. `BruteForceCard.js`（暴力破解组件）
遍历所有 10 位密钥，查找匹配“明文-密文”的可能密钥：
```javascript
import React from 'react';
import { Card, Form, Input, Button, Tag, Alert } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { bruteForceKey } from '../../service/Algorithm';

const BruteForceCard = ({ onBruteForceResult, bruteForceResult }) => {
  const [form] = Form.useForm();

  const handleBruteForce = async (values) => {
    const { plaintext, ciphertext } = values;
    if (plaintext.length !== 8 || ciphertext.length !== 8) {
      return Alert.error('明文和密文必须是 8 位二进制！');
    }

    // 开始破解前，初始化状态
    onBruteForceResult({
      keys: [],
      time: 0,
      progress: 0,
      running: true
    });

    const startTime = performance.now();
    const keys = await new Promise(resolve => {
      const foundKeys = bruteForceKey(plaintext, ciphertext, (progress) => {
        onBruteForceResult(prev => ({ ...prev, progress }));
      });
      resolve(foundKeys);
    });

    // 计算耗时并更新结果
    const timeSpent = (performance.now() - startTime).toFixed(2);
    onBruteForceResult({
      keys,
      time: timeSpent,
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
          <span>暴力破解-让我来好好教训教训你(๑•̀ㅂ•́)و✧</span>
        </div>
      } 
      bordered={false}
    >
      <Form form={form} onFinish={handleBruteForce}>
        <Form.Item 
          name="plaintext" 
          rules={[{ required: true, message: '请输入 8 位二进制明文' }]}
        >
          <Input placeholder="例如: 11010101" />
        </Form.Item>
        <Form.Item 
          name="ciphertext" 
          rules={[{ required: true, message: '请输入 8 位二进制密文' }]}
        >
          <Input placeholder="例如: 11001101" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">开始暴力破解</Button>
        </Form.Item>
      </Form>
      {bruteForceResult?.running && (
        <Alert 
          message={`正在暴力破解... 进度: ${bruteForceResult.progress}%`} 
          type="info" 
        />
      )}
      {bruteForceResult?.keys.length > 0 && (
        <div className="result-box warning">
          <p>破解结果</p >
          <p>耗时: {bruteForceResult.time} 毫秒</p >
          <p>找到 {bruteForceResult.keys.length} 个可能的密钥:</p >
          <div className="tag-group">
            {bruteForceResult.keys.map(key => (
              <Tag color="blue" key={key}>{key}</Tag>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BruteForceCard;
```

### 4. `AlgorithmInfoCard.js`（算法介绍组件）
为初学者科普 S-DES 算法的核心特点：
```javascript
import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const AlgorithmInfoCard = () => {
  return (
    <Card className="card-base" title="你学会了吗(๑•̀ㅂ•́)و✧" bordered={false}>
      <Paragraph>
        S-DES（Simplified Data Encryption Standard）是教学用简化版 DES 算法，使用 8 位分组和 10 位密钥，包含<Text strong>初始置换</Text>、<Text strong>轮函数</Text>、<Text strong>S 盒替换</Text>和<Text strong>最终置换</Text>等步骤。
      </Paragraph>
      <Paragraph>
        <Text strong>算法特点:</Text>
        <ul>
          <li>分组长度: 8-bit</li>
          <li>密钥长度: 10-bit</li>
          <li>加密公式: C = IP⁻¹(f<sub>k2</sub>(SW(f<sub>k1</sub>(IP(P))))</li>
          <li>解密公式: P = IP⁻¹(f<sub>k1</sub>(SW(f<sub>k2</sub>(IP(C))))</li>
        </ul>
      </Paragraph>
    </Card>
  );
};

export default AlgorithmInfoCard;
```


## 🚀 使用方法

### 1. 加密操作
- 进入“加密”卡片。
- 选择输入类型（`二进制`或`ASCII`）。
- 输入**明文**和**10 位二进制密钥**。
- 点击「加密」按钮，生成密文。

< img width="2879" height="1694" alt="Image" src="https://github.com/user-attachments/assets/da1de6ca-1e48-4e7a-9d23-42a5106c476c" />

### 2. 解密操作
- 进入“解密”卡片。
- 选择与密文匹配的输入类型（`二进制`或`ASCII`）。
- 输入**密文**和**加密时使用的密钥**。
- 点击「解密」按钮，还原明文。

< img width="2216" height="1040" alt="Image" src="https://github.com/user-attachments/assets/9a0d6a10-b3af-4758-a448-a2c1f8f336f3" />

### 3. 暴力破解
- 进入“暴力破解”卡片。
- 输入**8 位二进制明文**和**8 位二进制密文**。
- 点击「开始暴力破解」按钮，程序会遍历所有 10 位密钥，查找匹配的结果。

< img width="1792" height="1531" alt="Image" src="https://github.com/user-attachments/assets/ff5dcd95-9cc1-42e6-b348-dbe3c5c4e2c8" />


## 📌 总结

这个项目通过交互式 React 组件演示 S-DES 算法的全流程，适合用于学习**分组密码**、**密钥生成**、**暴力破解**等密码学基础概念。

如果有代码优化建议或功能需求,欢迎提出 !

