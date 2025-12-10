import { createE2ETestConfig } from '../../testing/test-setup-config/src/index.js';

export default createE2ETestConfig('plugin-stylelint-e2e', {
  testTimeout: 80_000,
});
