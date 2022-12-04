import { globalStyle, macaron$, style } from '@macaron-css/core';
import React from 'react';
import { Button } from '../../components/button';
import { Pre } from '../../components/pre';
import { screens } from '../../theme';
import fs from 'fs';
import path from 'path';
import { highlight } from '../../components/code-block';
import { navigate } from 'vite-plugin-ssr/client/router';

const code = macaron$(() => {
  const contents = fs.readFileSync(
    path.join(process.cwd(), 'src', 'code-examples', 'home.jsx'),
    'utf8'
  );

  return highlight(contents);
});

export function Page() {
  return (
    <main
      className={style({
        // width: '100%',
        maxWidth: '1200px',
        padding: '0 3vw',
        margin: '0 auto',
        '@media': {
          [screens.lg]: {
            maxWidth: '700px',
            padding: '6vh 20px',
          },
        },
      })}
    >
      <div
        className={style({
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        })}
      >
        <div
          className={style({
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
            className={style({
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
            <img
              className={style({ width: '80%' })}
              src="/macaron-stacked.svg"
            />
            <p
              className={style({
                fontSize: '1.3rem',
                lineHeight: 1.5,
                '@media': {
                  [screens.md]: { fontSize: '1.2rem' },
                  [screens.lg]: { textAlign: 'center' },
                },
              })}
            >
              Typesafe CSS-in-JS with zero runtime, colocation, maximum safety
              and productivity. Macaron is a new compile time CSS-in-JS library
              with type safety.
            </p>
            <div
              className={style({
                borderRadius: '15px',
                backdropFilter: 'brightness(80%) saturate(120%)',
                padding: '23px 25px',
                width: '100%',
              })}
            >
              <span
                className={style({
                  fontWeight: '500',
                  fontSize: '1.4rem',
                  color: 'white',
                  display: 'block',
                })}
              >
                Install macaron
              </span>
              <div
                className={style({
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
                  className={style({
                    padding: '0 10px 0 0',
                    color: '#bcbcd2',
                    userSelect: 'none',
                  })}
                >
                  $
                </span>
                npm install @macaron-css/core
              </div>
              <a
                className={style({
                  display: 'block',
                  color: '#bcbcd2',
                  fontWeight: '300',
                })}
                href="/docs/installation"
              >
                View installation docs
              </a>
            </div>
            <div className={style({ display: 'flex', gap: '10px' })}>
              <Button
                onClick={() => {
                  navigate('/docs/installation');
                }}
              >
                Documentation
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  navigate('/playground');
                }}
              >
                Playground
              </Button>
            </div>
          </div>
          <div className={style({ flex: 1, width: '100%' })}>
            <Pre
              className={style({
                boxShadow: '0px 10px 50px -10px #1e213c',
              })}
            >
              <code
                className={`language-jsx ${style({ display: 'block' })}`}
                dangerouslySetInnerHTML={{ __html: code }}
              />
            </Pre>
          </div>
        </div>
      </div>
    </main>
  );
}
