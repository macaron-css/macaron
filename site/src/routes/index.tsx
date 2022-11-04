import { style } from '@macaron-css/core';
import { Head, Link } from 'solid-start';
import { macaron$ } from '@macaron-css/core';
import { Pre } from '~/components/pre';
import fs from 'fs';
import path from 'path';
import { highlight } from '~/components/code-block';
import { screens, theme } from '~/theme';
import { Button } from '~/components/button';

const code = macaron$(() => {
  const contents = fs.readFileSync(
    path.join(process.cwd(), 'src', 'code-examples', 'home.js'),
    'utf8'
  );

  return highlight(contents);
});

export default function Home() {
  return (
    <div
      class={style({
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      })}
    >
      <div
        class={style({
          display: 'flex',
          alignItems: 'center',
          gap: '5vw',
          flexWrap: 'wrap',
          '@media': {
            [screens.lg]: {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            },
          },
        })}
      >
        <div
          class={style({
            color: 'white',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            '@media': {
              [screens.lg]: { alignItems: 'center' },
            },
          })}
        >
          <img class={style({ width: '80%' })} src="/macaron-stacked.svg" />
          <p
            class={style({
              fontSize: '1.3rem',
              lineHeight: 1.5,
              '@media': {
                [screens.md]: { fontSize: '1.2rem' },
                [screens.lg]: { textAlign: 'center' },
              },
            })}
          >
            Typesafe CSS-in-JS with zero runtime, colocation, maximum safety and
            productivity. Macaron is a new compile time CSS-in-JS library with
            type safety.
          </p>
          <div
            class={style({
              borderRadius: '15px',
              backdropFilter: 'brightness(80%) saturate(120%)',
              padding: '23px 25px',
              width: '100%',
            })}
          >
            <span
              class={style({
                fontWeight: '500',
                fontSize: '1.4rem',
                color: 'white',
                display: 'block',
              })}
            >
              Install macaron
            </span>
            <div
              class={style({
                margin: '15px 0',
                fontFamily: "'JetBrains Mono', monospace",
                padding: '15px 20px',
                fontWeight: 300,
                border: '2px solid #7977af',
                borderRadius: '8px',
                fontSize: '0.9rem',
                lineHeight: 1.3,
                '@media': {
                  [screens.lg]: { fontSize: '0.9rem' },
                },
              })}
            >
              <span
                class={style({
                  padding: '0 10px 0 0',
                  color: '#bcbcd2',
                  userSelect: 'none',
                })}
              >
                $
              </span>
              npm install @macaron-css/core
            </div>
            <small
              class={style({
                display: 'block',
                color: '#bcbcd2',
                fontWeight: '300',
              })}
            >
              View installation docs
            </small>
          </div>
          <div class={style({ display: 'flex', gap: '10px' })}>
            <Button>Documentation</Button>
            <Button color="secondary">Playground</Button>
          </div>
        </div>
        <div class={style({ flex: 1, width: '100%' })}>
          <Pre
            class={style({
              boxShadow: '0px 10px 50px -10px #1e213c',
            })}
          >
            <code
              class={`language-jsx ${style({ display: 'block' })}`}
              innerHTML={code}
            />
          </Pre>
        </div>
      </div>
    </div>
  );
}
