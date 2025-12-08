import { createE2ETestConfig } from '../../testing/test-setup-config/src/index.js';

export default createE2ETestConfig('plugin-knip-e2e', {
  testTimeout: 80_000,
});
