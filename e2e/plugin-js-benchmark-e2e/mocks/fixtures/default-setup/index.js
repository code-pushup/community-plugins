// Utility functions to benchmark
export function arrayMap(arr) {
  return arr.map((x) => x * 2);
}

export function arrayForLoop(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i] * 2);
  }
  return result;
}

export function stringConcat(str, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += str;
  }
  return result;
}

export function stringJoin(str, count) {
  return Array(count).fill(str).join('');
}
