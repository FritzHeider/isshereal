import React from 'react';
import Image from 'next/image';

/**
 * A photograph treated as a silver-gelatin print: warm monochrome,
 * pushed contrast, white border, optional tilt and grease-pencil caption.
 * Remote avatars bypass the optimizer (their hosts sign URLs).
 */
export function Print({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 48rem) 80vw, 33vw',
  priority = false,
  tilt = 0,
  frame,
  caption,
  size = 'm',
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  tilt?: number;
  frame?: string;
  caption?: React.ReactNode;
  size?: 's' | 'm' | 'l';
  className?: string;
}) {
  const remote = /^https?:\/\//.test(src);
  return (
    <figure
      className={['print', `print--${size}`, className].filter(Boolean).join(' ')}
      style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
    >
      <div className="print__emulsion">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          unoptimized={remote}
          className="print__img"
        />
      </div>
      {(frame || caption) && (
        <figcaption className="print__border">
          {frame ? <span className="print__frame">{frame}</span> : null}
          {caption ? <span className="print__caption">{caption}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}
