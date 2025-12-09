// Dummy benchmark suite for integration testing

function case1() {
  let sum = 0;
  for (let i = 0; i < 1000; i++) {
    sum += i;
  }
  return sum;
}

function case2() {
  let sum = 0;
  for (let i = 0; i < 1000; i++) {
    sum += i * 2;
  }
  return sum;
}

export default {
  suiteName: 'dummy-suite',
  targetImplementation: 'case-1',
  cases: [
    ['case-1', case1],
    ['case-2', case2],
  ],
};
