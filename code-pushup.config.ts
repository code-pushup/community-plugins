import bundleSizePlugin from './dist/packages/bundle-size';
import { fileSizePlugin } from './dist/packages/file-size';
export default {
  plugins: [bundleSizePlugin(), fileSizePlugin()],
};
