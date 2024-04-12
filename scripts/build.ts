import { join, posix } from 'path';
import { build as tsup } from 'tsup';

const packages: Array<[string, { entryPoints: string[]; esmOnly?: boolean }]> =
  [
    ['packages/babel', { entryPoints: ['src/index.ts'] }],
    ['packages/integration', { entryPoints: ['src/index.ts'] }],
    [
      'packages/vite',
      {
        entryPoints: ['src/index.ts'],
        esmOnly: true,
      },
    ],
    ['packages/esbuild', { entryPoints: ['src/index.ts'] }],
    [
      'packages/core',
      {
        entryPoints: [
          'src/index.ts',
          'src/create-runtime-fn.ts',
          'src/dynamic.ts',
          'src/types.ts',
        ],
      },
    ],
    [
      'packages/qwik',
      {
        entryPoints: ['src/index.ts', 'src/runtime.ts'],
        esmOnly: true,
      },
    ],
    ['packages/react', { entryPoints: ['src/index.ts', 'src/runtime.ts'] }],
    [
      'packages/solid',
      {
        entryPoints: ['src/index.ts', 'src/runtime.ts'],
        esmOnly: true,
      },
    ],
  ];

async function build() {
  const withDts = !process.argv.includes('--no-dts');
  const watch = process.argv.includes('--watch');

  for (const [packageDir, { entryPoints, esmOnly }] of packages) {
    try {
      await tsup({
        entry: entryPoints.map(entryPoint =>
          // tsup has some weird bug where it can't resolve backslashes
          posix.join(packageDir, entryPoint)
        ),
        format: esmOnly ? 'esm' : ['cjs', 'esm'],
        bundle: true,
        dts: withDts,
        sourcemap: true,
        outDir: join(packageDir, 'dist'),
        skipNodeModulesBundle: true,
        watch,
      });
    } catch (e) {
      console.error(e);
    }
  }
}

build();
