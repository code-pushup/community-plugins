import {PluginConfig} from "@code-pushup/models";

export default bundleSizePlugin;

export type BundleSizePluginOptions = {};
export function bundleSizePlugin(): PluginConfig {
    console.log('bundle-size plugin');
    return {
        slug: 'bundle-size',
        title: 'Bundle size',
        description: 'Bundle size plugin for Code PushUp',
        icon: "folder-css",
        runner: () => {
            return [
                {
                    slug: 'bundle-size',
                    score: 1,
                    value: 1
                },
            ];
        },
        audits: [
            {
                slug: 'bundle-size',
                title: 'Bundle size',
                description: 'Bundle size audit'
            },
        ],
    };
}
