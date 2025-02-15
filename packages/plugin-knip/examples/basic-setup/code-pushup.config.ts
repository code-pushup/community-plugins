import { knipPlugin } from '../../src/lib/knip.plugin';

export default ({
    plugins: [
        knipPlugin({
            rawOutputFile: './report/raw-knip-report.ts',
        }),
    ],
});
