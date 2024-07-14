import bundleSizePlugin from "../dist/packages/bundle-size/lib";
import {CoreConfig} from "@code-pushup/models";

export const config: CoreConfig = {
    plugins: [
        bundleSizePlugin()
    ],
    persist: {
        // outputDir: 'tmp/e2e',
    },
    ...config
};

export default config;
