// 辅助函数和工具

// 工具函数：二进制字符串转十进制
export const binToDec = (binStr) => parseInt(binStr, 2);

// 工具函数：十进制转二进制字符串（固定长度）
export const decToBin = (dec, length) => {
  const bin = dec.toString(2);
  return bin.padStart(length, '0');
};

// 工具函数：置换函数
export const permute = (input, permutationTable) => {
  return permutationTable.map(index => input[index - 1]).join('');
};

// 工具函数：循环左移
export const leftShift = (input, shiftCount) => {
  const arr = input.split('');
  for (let i = 0; i < shiftCount; i++) {
    arr.push(arr.shift());
  }
  return arr.join('');
};

// 工具函数：异或运算
export const xor = (a, b) => {
  let result = '';
  for (let i = 0; i < a.length; i++) {
    result += a[i] === b[i] ? '0' : '1';
  }
  return result;
};

// 工具函数：S盒替换
export const sBoxSubstitution = (input, sBox) => {
  const row = binToDec(input[0] + input[3]);
  const col = binToDec(input[1] + input[2]);
  return decToBin(sBox[row][col], 2);
};

// 工具函数：ASCII字符串转二进制数组
export const asciiToBinaryArray = (str) => {
  return str.split('').map(char => {
    const charCode = char.charCodeAt(0);
    return decToBin(charCode, 8);
  });
};

// 工具函数：二进制数组转ASCII字符串
export const binaryArrayToAscii = (binaryArray) => {
  return binaryArray.map(bin => {
    const charCode = binToDec(bin);
    return String.fromCharCode(charCode);
  }).join('');
};