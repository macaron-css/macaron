import React, { PropsWithChildren, useState } from 'react';
import { globalStyle, style } from '@macaron-css/core';
import { styled } from '@macaron-css/react';
import { Link } from '../../../renderer/Link';

globalStyle('blockquote', {
  padding: '0.8rem',
  borderLeft: '2px solid #ff4089',
  background: '#ffffff10',
});

globalStyle('blockquote p', {
  fontSize: '0.8rem !important',
});

globalStyle('#docs p code, #docs p a', {
  background: 'rgba(255,255,255, 0.2)',
  padding: '2px 4px',
  borderRadius: '5px',
  color: 'white',
});

globalStyle('.ch-scrollycoding-step-content', {
  padding: '1rem !important',
  margin: '0.5rem 0 !important',
  border: '1px solid #7977af2b !important',
});

globalStyle('.ch-codeblock, .ch-codegroup', {
  border: '1px solid #3f3e63 !important',
});

globalStyle('.ch-scrollycoding-step-content[data-selected]', {
  border: '2px solid #ff4089 !important',
  backdropFilter: 'brightness(80%) saturate(120%) !important',
});

globalStyle('.ch-codegroup .ch-editor-button, .ch-codeblock .ch-code-button', {
  display: "none",
});

globalStyle('.ch-codegroup:hover .ch-editor-button, .ch-codeblock:hover .ch-code-button', {
  display: "block",
});

const MarkdownView = styled('div', {
  base: {
    width: '100%',
    position: 'relative',
    padding: '2rem',
    fontFamily: 'system-ui',
    color: 'white',
    lineHeight: '1.75rem',
    right: '5px',
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
        <a
          className={style({ color: 'white' })}
          href="https://github.com/macaron-css/macaron"
        >
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="3 3 18 18"
            aria-hidden="true"
          >
            <title>GitHub</title>
            <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"></path>
          </svg>
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
          <SidebarLink href="/docs/working">How it works</SidebarLink>
          {/* <SidebarLink href="/docs/working">How it works</SidebarLink> */}
        </Sidebar>
        <MarkdownView>{props.children}</MarkdownView>
      </div>
    </div>
  );
}
