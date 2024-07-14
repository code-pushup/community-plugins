import {PluginConfig} from "@code-pushup/models";

export default bundleSizePlugin;

export function bundleSizePlugin(): PluginConfig {
    return {
        slug: 'bundle-size',
        title: 'Bundle size',
        description: 'Bundle size plugin for Code PushUp',
        icon: "file",
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
