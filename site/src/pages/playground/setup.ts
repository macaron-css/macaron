import Buffer from 'buffer';

if (typeof document !== 'undefined') {
  globalThis.process = {
    env: {
      BABEL_TYPES_8_BREAKING: false,
    },
  };

  globalThis.Buffer = Buffer.Buffer;
}
