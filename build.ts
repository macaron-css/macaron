import { join, posix } from 'path';
import { build as tsup } from 'tsup';

const packages: Array<[string, string, string[]]> = [
  ['@comptime-css/babel', 'packages/babel', ['src/index.ts']],
  ['@comptime-css/esbuild', 'packages/esbuild', ['src/index.ts']],
  ['comptime-css', 'packages/comptime-css', ['src/index.ts']],
  ['@comptime-css/solid', 'packages/solid', ['src/index.ts', 'src/runtime.ts']],
];

async function build() {
  for (const [_name, packageDir, entryPoints] of packages) {
    try {
      await tsup({
        entry: entryPoints.map(entryPoint =>
          // tsup has some weird bug where it can't resolve backslashes
          posix.join(packageDir, entryPoint)
        ),
        format: ['cjs', 'esm'],
        bundle: true,
        dts: true,
        sourcemap: true,
        outDir: join(packageDir, 'dist'),
        skipNodeModulesBundle: true,
      });
    } catch (e) {
      console.error(e);
    }
  }
}

build();
