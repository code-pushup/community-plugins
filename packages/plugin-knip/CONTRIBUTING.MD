# Contributing

The [knip](https://knip.dev/) plugin implementation is restricted due to [a bug that wont get fixed](https://github.com/webpro/knip/issues/551).

As we can't consume knip core logic because it produces an unwanted side effect (linked above), we have to implement a `RunnerConfig` instead of a  `RunnerFunction`.
Our current solution is to implement a [custom knip reporter](https://knip.dev/features/reporters#custom-reporters) which is bundled as an [additional entry point](./src/reporter.ts).
The produced output is internally consumed by the `RunnerConfig` and wrapped into a `PluginReport`.
