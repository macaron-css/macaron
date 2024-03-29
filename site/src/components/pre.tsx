import { globalStyle, macaron$ } from '@macaron-css/core';
import { styled } from '@macaron-css/react';
import { screens } from '../theme';

export const Pre = styled('pre', {
  base: {
    boxSizing: 'border-box',
    borderRadius: '8px',
    padding: '20px ',
    // overflow: 'auto',
    fontSize: '15px',
    lineHeight: '19px',
    whiteSpace: 'pre',
    position: 'relative',
    color: 'hsl(210 6.0% 93.0%)',
    backdropFilter: 'brightness(70%) saturate(120%)',
    maxHeight: '80vh',
    '@media': {
      [screens.lg]: { fontSize: '13px' },
    },
  },
});

globalStyle(`${Pre} code`, {
  fontFamily: "'JetBrains Mono', monospace !important",
});

macaron$(() => {
  const styles = {
    '.token.parameter': {
      color: '#ecedee',
    },
    '.token.tag, .token.class-name, .token.selector, .token.selector .class, .token.function':
      {
        color: '#bcbcd2',
      },
    '.token.attr-value, .token.class, .token.string, .token.number, .token.unit, .token.color, .token.boolean':
      {
        color: '#ff7cae',
      },

    '.token.attr-name, .token.keyword, .token.rule, .token.operator, .token.pseudo-class, .token.important':
      {
        color: '#EC2B6C',
      },

    '.token.punctuation, .token.module, .token.property': {
      color: '#bcbcd2',
    },

    '.token.comment': {
      color: '#798086',
    },

    '.token.atapply .token:not(.rule):not(.important)': {
      color: 'inherit',
    },

    '.language-shell .token:not(.comment)': {
      color: 'inherit',
    },

    '.language-css .token.function': {
      color: 'inherit',
    },

    '.token.deleted:not(.prefix), .token.inserted:not(.prefix)': {
      display: 'block',
      padding: '0 $4',
      margin: '0 -20px',
    },

    '.token.deleted:not(.prefix)': {
      color: 'hsl(358deg 100% 70%)',
    },

    '.token.inserted:not(.prefix)': {
      color: '$$added',
    },

    '.token.deleted.prefix, .token.inserted.prefix': {
      userSelect: 'none',
    },

    // Line numbers
    // '&[data-line-numbers=true]': {
    //   '.highlight-line': {
    //     position: 'relative',
    //     paddingLeft: '$4',

    //     '&::before': {
    //       content: 'attr(data-line)',
    //       position: 'absolute',
    //       left: -5,
    //       top: 0,
    //       color: '$$lineNumbers',
    //     },
    //   },
    // },

    // Styles for highlighted lines
    '.highlight-line': {
      // '&, *': {
      //   transition: 'color 150ms ease',
      // },
      // '&[data-highlighted=false]': {
      //   '&, *': {
      //     color: '$$fadedLines',
      //   },
      // },
    },
    '.typewriter': {
      opacity: 0,
    },
  };

  for (const [selector, style] of Object.entries(styles)) {
    globalStyle(`${Pre} ${selector}`, style as any);
  }
});
