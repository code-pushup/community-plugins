import { arrayForLoop, arrayMap } from '../index.js';

const testData = Array.from({ length: 1000 }, (_, i) => i);

export default {
  suiteName: 'array-operations',
  targetImplementation: 'array-map',
  cases: [
    ['array-map', () => arrayMap(testData)],
    ['array-for-loop', () => arrayForLoop(testData)],
  ],
};
