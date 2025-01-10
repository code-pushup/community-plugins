# @code-pushup/knip-plugin

[![npm](https://img.shields.io/npm/v/%40code-pushup%2Feslint-plugin.svg)](https://www.npmjs.com/package/@code-pushup/knip-plugin)
[![downloads](https://img.shields.io/npm/dm/%40code-pushup%2Feslint-plugin)](https://npmtrends.com/@code-pushup/knip-plugin)
[![dependencies](https://img.shields.io/librariesio/release/npm/%40code-pushup/knip-plugin)](https://www.npmjs.com/package/@code-pushup/knip-plugin?activeTab=dependencies)

🕵️ **Code PushUp plugin to detect dependency and code usage.** ✂️

---

## Getting started

TBD

## Knip CodePushup reporter

The plugin maintains a [custom knip reporter](./src/lib/reporter/reporter.ts) to produce the audit outputs. It is used internally, but is also exported for public use.

_Use custom reporter manually:_

```bash
npx knip --reporter=./dist/packages/plugin-knip/reporter.js
```

The reporter also accepts options in for of a JSON string.

_Use custom reporter options:_

```bash
npx knip --reporter=./dist/packages/plugin-knip/reporter.js  --reporter-options='{"outputFile":".code-pushup/knip/knip.report.json","rawOutputFile":".code-pushup/knip/knip.raw.report.json", "verbose": true}'
```
