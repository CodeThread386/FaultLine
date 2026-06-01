'use client';

import React from 'react';

interface GlitchTextProps {
  children: string;
  className?: string;
  alwaysOn?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

/**
 * GlitchText — wraps text in a span with CSS ::before / ::after pseudo-elements
 * that briefly split into red + electric-blue color-shifted copies on hover
 * (or continuously if alwaysOn = true).
 */
export default function GlitchText({
  children,
  className = '',
  alwaysOn = false,
  tag: Tag = 'span',
}: GlitchTextProps) {
  const classes = [
    'glitch-text',
    alwaysOn ? 'glitch-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // @ts-expect-error — dynamic tag, types are fine at runtime
    <Tag
      className={classes}
      data-text={children}
    >
      {children}
    </Tag>
  );
}
