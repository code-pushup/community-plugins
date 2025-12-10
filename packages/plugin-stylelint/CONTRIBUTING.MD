# Contributing

The [stylelint](https://stylelint.dev/) plugin implementation is restricted due to [a bug that won't get fixed](https://github.com/webpro/stylelint/issues/551).

As we can't consume stylelint core logic because it produces an unwanted side effect (linked above), we have to implement a `RunnerConfig` instead of a  `RunnerFunction`.
Our current solution is to implement a [custom stylelint reporter](https://stylelint.dev/features/reporters#custom-reporters) which is bundled as an [additional entry point](src/lib/reporter.ts).
The produced output is internally consumed by the `RunnerConfig` and wrapped into a `PluginReport`.
