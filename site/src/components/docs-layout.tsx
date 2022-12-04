import React, { PropsWithChildren, useState } from 'react';
import { globalStyle, style } from '@macaron-css/core';
import { styled } from '@macaron-css/react';
import { Link } from '../../renderer/Link';

globalStyle('#docs p code, #docs p a', {
  background: 'rgba(255,255,255, 0.2)',
  padding: '2px 4px',
  borderRadius: '5px',
  color: 'white',
});

globalStyle('.ch-scrollycoding-step-content', {
  padding: '1rem',
  margin: '0.5rem 0',
  border: '1px solid #7977af2b',
});

globalStyle('.ch-codeblock, .ch-codegroup', {
  border: '1px solid #3f3e63',
});

globalStyle('.ch-scrollycoding-step-content[data-selected]', {
  border: '2px solid #ff4089',
  backdropFilter: 'brightness(80%) saturate(120%)',
});

const MarkdownView = styled('div', {
  base: {
    maxWidth: '100%',
    position: 'relative',
    padding: '2rem',
    fontFamily: 'system-ui',
    color: 'white',
    lineHeight: '1.75rem',
  },
});

globalStyle(`${MarkdownView} h1`, {
  fontSize: '2.5rem',
  fontWeight: '600',
  backgroundClip: 'text',
  backgroundImage: 'linear-gradient(60deg, #ff4089, #ff81b1)',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  margin: '0.5rem 0 2rem',
  paddingBottom: '10px',
});

globalStyle(`${MarkdownView} h2`, {
  fontSize: '2rem',
  margin: '2rem 0 1rem',
  fontWeight: '500',
  backgroundClip: 'text',
  backgroundImage: 'linear-gradient(60deg, #ff4089, #ff81b1)',
  WebkitBackgroundClip: 'text',
  paddingBottom: '10px',
  color: 'transparent',
});

globalStyle(`${MarkdownView} p`, {
  fontSize: '1.1rem',
  fontWeight: 300,
});

globalStyle(`${MarkdownView} h3`, {
  marginTop: '1rem',
  fontSize: '1.25rem',
  // color: '#ff81b1',
  fontWeight: '500',
  marginBottom: '0.5rem',
});

const Sidebar = styled('aside', {
  base: {
    height: 'calc(100vh - 4rem)',
    padding: '1rem',
    position: 'fixed',
    boxShadow:
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.1) -1px 0px 0px 0px inset',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    gap: '0.2rem',
    fontSize: '1.1rem',
    transform: 'translateY(-100%)',
    top: '4rem',
    '@media': {
      '(min-width: 1024px)': {
        minWidth: '16rem',
        position: 'sticky',
        transform: 'translate(0)',
      },
      '(max-width: 1024px)': {
        zIndex: 10,
        width: '100%',
        background: 'rgb(22,24,38)',
        transition: 'transform .8s cubic-bezier(.52,.16,.04,1)',
      },
    },
  },
  variants: {
    isOpen: {
      true: {
        transform: 'translate(0)',
      },
    },
  },
});

globalStyle(`body:has(${Sidebar.selector({ isOpen: true })})`, {
  overflow: 'hidden',
});

globalStyle(`${Sidebar} a.is-active`, {
  backgroundColor: '#ff307f57',
});

const SidebarLink = styled(Link, {
  base: {
    color: 'white',
    padding: '0.5rem',
    borderRadius: '5px',
    background: 'transparent',
    transition: 'background 100ms ease-in-out ',
  },
});

const MenuIcon = styled('button', {
  base: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
    padding: '5px',
    '@media': {
      '(min-width: 1024px)': {
        display: 'none',
      },
    },
  },
  variants: {
    isOpen: {
      true: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        boxShadow: '#ff4089 0px 0px 0px 1px inset',
      },
    },
  },
});

export function DocsLayout(props: PropsWithChildren) {
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <div id="docs">
      <div
        className={style({
          height: '4rem',
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(12px)',
          background: 'rgba(22,24,38,0.6)',
          zIndex: 20,
          boxShadow:
            'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.1) 0px -1px 0px 0px inset',
          display: 'flex',
          padding: '0 1.5rem',
          gap: '1rem',
          justifyContent: 'flex-end',
          alignItems: 'center',
          '@media': {
            '(min-width: 1024px)': {
              padding: '0 2rem',
            },
          },
        })}
      >
        <a href="/" className={style({ marginRight: 'auto' })}>
          <img
            className={style({ height: '2rem', display: 'block' })}
            src="/macaron-inline.svg"
          />
        </a>
        <a
          href="/docs/installation"
          className={style({
            color: 'white',
            fontSize: '1.2rem',
          })}
        >
          Docs
        </a>
        <MenuIcon isOpen={isNavOpen} onClick={() => setNavOpen(!isNavOpen)}>
          <svg
            fill="none"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={style({ display: 'block' })}
          >
            <g>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16"
              ></path>
            </g>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 12h16"
            ></path>
            <g>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 18h16"
              ></path>
            </g>
          </svg>
        </MenuIcon>
      </div>
      <div
        className={style({
          display: 'flex',
          flexDirection: 'row',
          '@media': {
            '(max-width: 1024px)': {
              flexDirection: 'column',
            },
          },
        })}
      >
        <Sidebar isOpen={isNavOpen}>
          <SidebarLink href="/docs/installation">Installation</SidebarLink>
          <SidebarLink href="/docs/styling">Styling</SidebarLink>
          <SidebarLink href="/docs/theming">Theming</SidebarLink>
          {/* <SidebarLink href="/docs/working">How it works</SidebarLink> */}
        </Sidebar>
        <MarkdownView>{props.children}</MarkdownView>
      </div>
    </div>
  );
}
