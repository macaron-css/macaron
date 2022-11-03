import { style } from '@macaron-css/core';
import { Head, Link } from 'solid-start';
import { macaron$ } from '@macaron-css/core';
import { Pre } from '~/components/pre';
import fs from 'fs';
import path from 'path';
import { highlight } from '~/components/code-block';

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
      {/* <nav>Docs</nav> */}
      <div
        class={style({
          display: 'flex',
          alignItems: 'center',
          gap: '5vw',
          // justifyContent: 'space-around',
          color: 'white',
          // maxHeight: '100%',
        })}
      >
        <div
          class={style({
            flex: 1,
            marginTop: '-40px',
          })}
        >
          <img
            class={style({
              // height: '17vh',
              width: '100%',
              // padding: '20px 0',
            })}
            src="/macaron-inline.svg"
          />
          <p
            class={style({
              fontSize: '1.3rem',
              margin: '35px 0',
              lineHeight: 1.5,
            })}
          >
            Typesafe CSS-in-JS with zero runtime, colocation, maximum safety and
            productivity. Macaron is a new compile time CSS-in-JS library with
            type safety.
          </p>
          <div
            class={style({
              marginTop: '20px',
              borderRadius: '15px',
              border: '2px solid #ff4089',
              // boxShadow: '2px 2px #111630',
              padding: '20px 25px',
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
                fontFamily: "'IBM Plex Mono', monospace",
                padding: '15px 20px',
                // backgroundColor: '#343355',
                border: '2px solid #656395',
                backgroundColor: '#15171827',
                borderRadius: '8px',
                fontSize: '1rem',
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
        </div>
        <div class={style({ flex: 1 })}>
          <Pre>
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
