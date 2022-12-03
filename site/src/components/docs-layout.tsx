import React, { PropsWithChildren } from 'react';
import { globalStyle, style } from '@macaron-css/core';
import { styled } from '@macaron-css/react';
import { Link } from '../../renderer/Link';

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

globalStyle('#docs p code, #docs p a', {
  background: 'rgba(255,255,255, 0.2)',
  padding: '2px 4px',
  borderRadius: '5px',
  color: 'white',
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
  margin: '2rem 0 1.5rem',
  fontWeight: '500',
  backgroundClip: 'text',
  backgroundImage: 'linear-gradient(60deg, #ff4089, #ff81b1)',
  WebkitBackgroundClip: 'text',
  paddingBottom: '10px',
  color: 'transparent',
});

globalStyle(`${MarkdownView} p`, {
  fontSize: '1em',
  fontWeight: 400,
});

globalStyle(`${MarkdownView} h3`, {
  marginTop: '1rem',
  fontSize: '1.25rem',
  // color: '#ff81b1',
  fontWeight: '500',
  marginBottom: '0.5rem',
});

globalStyle('.ch-scrollycoding-step-content', {
  padding: '1rem',
  margin: '0.5rem 0',
  border: '1px solid #7977af2b',
});

globalStyle('.ch-scrollycoding-step-content[data-selected]', {
  border: '2px solid #ff4089',
  backdropFilter: 'brightness(80%) saturate(120%)',
});

const Sidebar = styled('aside', {
  base: {
    minWidth: '16rem',
    position: 'sticky',
    top: '4rem',
    height: 'calc(100vh - 4rem)',
    padding: '1rem',
    boxShadow:
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.1) -1px 0px 0px 0px inset',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    gap: '0.2rem',
    fontSize: '1.1rem',
  },
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
    transition: 'background 3000ms ease-in-out ',
  },
});

export function DocsLayout(props: PropsWithChildren) {
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
          padding: '0 2rem',
          gap: '0.5rem',
          justifyContent: 'flex-end',
          alignItems: 'center',
        })}
      >
        <a href="/" className={style({ marginRight: 'auto' })}>
          <img
            className={style({ height: '2.75rem' })}
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
      </div>
      <div className={style({ display: 'flex' })}>
        <Sidebar>
          <SidebarLink href="/docs/installation">Installation</SidebarLink>
          <SidebarLink href="/docs/styling">Styling</SidebarLink>
          <SidebarLink href="/docs/theming">Theming</SidebarLink>
          <SidebarLink href="/docs/working">How it works</SidebarLink>
        </Sidebar>
        <MarkdownView>{props.children}</MarkdownView>
      </div>
    </div>
  );
}
