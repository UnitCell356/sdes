// S-DES算法核心实现
import {
  permute, leftShift, xor, sBoxSubstitution,
  asciiToBinaryArray, binaryArrayToAscii
} from './SDESUtils';

// 常量定义
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

// 生成子密钥
export const generateSubKeys = (key) => {
  // P10置换
  const p10Key = permute(key, P10);

  // 分成左右两部分
  const left = p10Key.substring(0, 5);
  const right = p10Key.substring(5);

  // 循环左移1位
  const leftShift1 = leftShift(left, 1);
  const rightShift1 = leftShift(right, 1);

  // 生成k1
  const k1 = permute(leftShift1 + rightShift1, P8);

  // 循环左移2位
  const leftShift2 = leftShift(leftShift1, 2);
  const rightShift2 = leftShift(rightShift1, 2);

  // 生成k2
  const k2 = permute(leftShift2 + rightShift2, P8);

  return { k1, k2 };
};

// F函数
const fFunction = (right, subKey) => {
  // 扩展置换
  const expanded = permute(right, EP);

  // 与子密钥异或
  const xored = xor(expanded, subKey);

  // 分成两部分
  const leftXor = xored.substring(0, 4);
  const rightXor = xored.substring(4);

  // S盒替换
  const s1 = sBoxSubstitution(leftXor, SBOX1);
  const s2 = sBoxSubstitution(rightXor, SBOX2);

  // P4置换
  const p4 = permute(s1 + s2, P4);

  return p4;
};

// SW函数（交换左右两部分）
const sw = (input) => {
  return input.substring(4) + input.substring(0, 4);
};

// 8位加密
export const encrypt8bit = (plaintext, key) => {
  const { k1, k2 } = generateSubKeys(key);

  // 初始置换
  const ip = permute(plaintext, IP);

  // 分成左右两部分
  let left = ip.substring(0, 4);
  let right = ip.substring(4);

  // 第一轮：F函数 + SW
  const f1 = fFunction(right, k1);
  const xorLeft1 = xor(left, f1);
  const afterSW = sw(xorLeft1 + right);

  // 更新左右部分
  left = afterSW.substring(0, 4);
  right = afterSW.substring(4);

  // 第二轮：F函数
  const f2 = fFunction(right, k2);
  const xorLeft2 = xor(left, f2);

  // 最终置换
  const ciphertext = permute(xorLeft2 + right, IP_INV);

  return ciphertext;
};

// 8位解密
export const decrypt8bit = (ciphertext, key) => {
  const { k1, k2 } = generateSubKeys(key);

  // 初始置换
  const ip = permute(ciphertext, IP);

  // 分成左右两部分
  let left = ip.substring(0, 4);
  let right = ip.substring(4);

  // 第一轮：F函数 + SW
  const f1 = fFunction(right, k2);
  const xorLeft1 = xor(left, f1);
  const afterSW = sw(xorLeft1 + right);

  // 更新左右部分
  left = afterSW.substring(0, 4);
  right = afterSW.substring(4);

  // 第二轮：F函数
  const f2 = fFunction(right, k1);
  const xorLeft2 = xor(left, f2);

  // 最终置换
  const plaintext = permute(xorLeft2 + right, IP_INV);

  return plaintext;
};

// ASCII字符串加密
export const encryptAscii = (plaintext, key) => {
  const binaryArray = asciiToBinaryArray(plaintext);
  const encryptedArray = binaryArray.map(bin => encrypt8bit(bin, key));
  return binaryArrayToAscii(encryptedArray);
};

// ASCII字符串解密
export const decryptAscii = (ciphertext, key) => {
  const binaryArray = asciiToBinaryArray(ciphertext);
  const decryptedArray = binaryArray.map(bin => decrypt8bit(bin, key));
  return binaryArrayToAscii(decryptedArray);
};

// 暴力破解密钥
export const bruteForceKey = (plaintext, ciphertext, onProgress) => {
  const total = 1024; // 2^10
  const foundKeys = [];

  for (let i = 0; i < total; i++) {
    const key = i.toString(2).padStart(10, '0');
    const encrypted = encrypt8bit(plaintext, key);

    if (encrypted === ciphertext) {
      foundKeys.push(key);
    }

    // 更新进度
    if (onProgress && i % 100 === 0) {
      onProgress(Math.round((i / total) * 100));
    }
  }

  return foundKeys;
};