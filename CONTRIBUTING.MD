# Contributors Guide

## Contributing to existing plugins

## Creating a new plugin

### Proposal

### Development

#### Setup

**Add a library**
To create a new library in the monorepo, run the following command:

```bash

npx nx g @nx/js:lib [package-name] --directory=packages/[package-name] --projectNameAndRootFormat=as-provided --bundler=esbuild --unitTestRunner=vitest --module=esm --tags=scope:plugin 

```

**Add an e2e test project**

To create a new e2e test project in the monorepo, run the following command:

```bash
npx nx g @nx/js:lib e2e-[package-name] --directory=e2e/[package-name] --projectNameAndRootFormat=as-provided --bundler=none --unitTestRunner=vitest --tags=type:e2e 
```



Notes:
- The project bundle-size is using the 'generatePackageJson' option which is deprecated for library projects. It should only be used for applications.
  For libraries, configure the project to use the '@nx/dependency-checks' ESLint rule instead (https://nx.dev/nx-api/eslint-plugin/documents/dependency-checks).

// generate testing helper lib testing/utils with name testing-utils
