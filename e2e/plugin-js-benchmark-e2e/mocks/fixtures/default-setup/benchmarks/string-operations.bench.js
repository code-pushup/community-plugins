import { stringConcat, stringJoin } from '../index.js';

export default {
  suiteName: 'string-operations',
  targetImplementation: 'string-join',
  cases: [
    ['string-concat', () => stringConcat('test', 100)],
    ['string-join', () => stringJoin('test', 100)],
  ],
};
