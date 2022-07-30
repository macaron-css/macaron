import Buffer from 'buffer';

globalThis.process = {
  env: {
    BABEL_TYPES_8_BREAKING: false,
  },
} as any;
globalThis.Buffer = Buffer.Buffer;
