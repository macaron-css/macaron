import Buffer from 'buffer';

window.process = {
  env: {
    BABEL_TYPES_8_BREAKING: false,
  },
};
window.Buffer = Buffer.Buffer;
