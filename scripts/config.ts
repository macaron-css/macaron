import path from 'path';
import { BranchConfig, Package } from './types';

// TODO: List your npm packages here. The first package will be used as the versioner.
export const packages: Package[] = [
  {
    name: '@macaron-css/core',
    packageDir: 'core',
    srcDir: 'src',
  },
  {
    name: '@macaron-css/react',
    packageDir: 'react',
    srcDir: 'src',
  },
  {
    name: '@macaron-css/solid',
    packageDir: 'solid',
    srcDir: 'src',
  },
  {
    name: '@macaron-css/integration',
    packageDir: 'integration',
    srcDir: 'src',
    dependencies: ['@macaron-css/babel'],
  },
  {
    name: '@macaron-css/babel',
    packageDir: 'babel',
    srcDir: 'src',
  },
  {
    name: '@macaron-css/vite',
    packageDir: 'vite',
    srcDir: 'src',
    dependencies: ['@macaron-css/integration'],
  },
  {
    name: '@macaron-css/esbuild',
    packageDir: 'esbuild',
    srcDir: 'src',
    peerDependencies: ['@macaron-css/integration'],
  },
];

export const latestBranch = 'main';

export const branchConfigs: Record<string, BranchConfig> = {
  main: {
    prerelease: false,
    ghRelease: true,
  },
  // next: {
  //   prerelease: true,
  //   ghRelease: true,
  // },
  // beta: {
  //   prerelease: true,
  //   ghRelease: true,
  // },
  // alpha: {
  //   prerelease: true,
  //   ghRelease: true,
  // },
};

export const rootDir = path.resolve(__dirname, '..');
export const examplesDirs = [
  'examples/react',
  'examples/solid',
  'examples/solid-start',
  'examples/vanilla',
  'examples/vite',
];
