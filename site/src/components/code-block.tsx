import { refractor } from 'refractor/lib/core';
import js from 'refractor/lang/javascript';
import jsx from 'refractor/lang/jsx';
import bash from 'refractor/lang/bash';
import css from 'refractor/lang/css';
import diff from 'refractor/lang/diff';
import { toHtml } from 'hast-util-to-html';
import { macaron$ } from '@macaron-css/core';

export function highlight(contents: string) {
  refractor.register(js);
  refractor.register(jsx);
  refractor.register(bash);
  refractor.register(css);
  refractor.register(diff);

  return toHtml(refractor.highlight(contents, 'js'));
}

// export const res =
