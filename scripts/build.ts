import { join, posix } from 'path';
import { build as tsup } from 'tsup';

const packages: Array<[string, string[]]> = [
  ['packages/babel', ['src/index.ts']],
  ['packages/vite', ['src/index.ts']],
  ['packages/esbuild', ['src/index.ts']],
  ['packages/comptime-css', ['src/index.ts']],
  ['packages/solid', ['src/index.ts', 'src/runtime.ts']],
];

async function build() {
  const dts = process.argv[2];

  for (const [packageDir, entryPoints] of packages) {
    try {
      await tsup({
        entry: entryPoints.map(entryPoint =>
          // tsup has some weird bug where it can't resolve backslashes
          posix.join(packageDir, entryPoint)
        ),
        format: ['cjs', 'esm'],
        bundle: true,
        dts: dts !== '--no-dts',
        sourcemap: true,
        outDir: join(packageDir, 'dist'),
        skipNodeModulesBundle: true,
        watch: true,
      });
    } catch (e) {
      console.error(e);
    }
  }
}

build();
