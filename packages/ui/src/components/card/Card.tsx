'use client';

import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export const cardVariants = tv({
  base: [
    'relative isolate overflow-hidden rounded-2xl',
    'transition-all duration-300 ease-out',
    'transform-gpu outline-none [backface-visibility:hidden]',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0',
    'will-change-[transform,box-shadow,backdrop-filter]',
  ],
  variants: {
    appearance: {
      glass: [
        // true glassmorphism base
        'backdrop-blur-xl backdrop-saturate-150',
        'ring-primary ring-1',
        'bg-white/10',
        // inner light reflection (key glassmorphism element)
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[""]',
        'before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-60',
      ],
      solid: [
        // use the primary gradient for solids
        'bg-[var(--gradient-primary)]',
        'border-black/10 dark:border-white/10',
        'shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
      ],
    },
    size: {
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    },
    elevation: {
      none: '',
      sm: 'shadow-1',
      md: 'shadow-2',
      lg: 'shadow-3',
    },
    hover: {
      none: '',
      lift: 'hover:-translate-y-0.5',
      scale: 'hover:shadow-1 hover:scale-[1.015]',
      glow: 'hover:shadow-3',
    },
    interactive: {
      true: 'group cursor-pointer',
      false: '',
    },
    disabled: {
      true: 'pointer-events-none opacity-60',
      false: '',
    },
  },
  compoundVariants: [
    // brighten glass on hover if interactive
    {
      appearance: 'glass',
      interactive: true,
      class: ['hover:bg-white/12 dark:hover:bg-white/7', 'hover:backdrop-blur-2xl'],
    },
  ],
  defaultVariants: {
    appearance: 'glass',
    size: 'md',
    elevation: 'md',
    hover: 'lift',
    interactive: false,
    disabled: false,
  },
});

/* ----- Subcomponent builders (TV only) ----- */

const cardHeader = tv({ base: 'mb-3' });
const cardBody = tv({ base: 'space-y-2' });

const cardImage = tv({
  base: ['ring-primary relative mb-3 overflow-hidden rounded-xl ring-1'],
  variants: {
    aspect: {
      auto: 'h-32',
      '1/1': 'aspect-square',
      '4/3': 'aspect-[4/3]',
      '3/4': 'aspect-[3/4]',
      '16/9': 'aspect-video',
    },
  },
  defaultVariants: { aspect: 'auto' },
});

const cardImageImg = tv({
  base: ['h-full w-full object-cover opacity-0 transition-opacity duration-500'],
  variants: { loaded: { true: 'opacity-100' } },
  defaultVariants: { loaded: false },
});

const cardBadge = tv({
  base: 'text-fg-inverse absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur-sm',
});

const cardTitle = tv({
  base: 'text-fg-muted truncate text-sm font-bold',
});

const cardSubtitle = tv({
  base: 'text-fg-muted flex items-center justify-between text-xs',
});

const cardTag = tv({
  // lavender-glass chip
  base: 'text-fg-inverse ring-primary-glass bg-primary-glass rounded-full px-2 py-1 text-xs font-semibold ring-1 backdrop-blur-sm',
});

const cardAttributes = tv({ base: 'mt-2 flex flex-wrap gap-1' });

const cardAttribute = tv({
  base: 'text-fg-inverse ring-primary-glass bg-primary-glass-strong rounded-full px-2 py-1 text-xs font-bold ring-1 backdrop-blur-sm',
});

const cardDescription = tv({
  base: 'text-fg-muted mt-2 line-clamp-2 text-xs',
});

/* ----- Types ----- */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof cardImage> {
  placeholder?: React.ReactNode;
  badge?: React.ReactNode;
}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardSubtitleProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTagProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface CardAttributesProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardAttributeProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/* ----- Components ----- */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, appearance, size, elevation, hover, interactive, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ appearance, size, elevation, hover, interactive, disabled, className })}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cardHeader({ className })}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cardBody({ className })}
    {...props}
  />
));
CardBody.displayName = 'CardBody';

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, placeholder, badge, onError, onLoad, src, alt = '', aspect, ...imgProps }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    return (
      <div className={cardImage({ aspect, className })}>
        {!hasError && src ? (
          <>
            <img
              ref={ref}
              src={src}
              alt={alt}
              onError={e => {
                setHasError(true);
                onError?.(e);
              }}
              onLoad={e => {
                setLoaded(true);
                onLoad?.(e);
              }}
              className={cardImageImg({ loaded })}
              {...imgProps}
            />
            {/* top shine */}
            <div className='pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.25),transparent_35%)]' />
          </>
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-[var(--gradient-primary)]'>
            {placeholder || (
              <svg
                className='h-10 w-10 text-white/90'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            )}
          </div>
        )}
        {badge && <div className={cardBadge()}>{badge}</div>}
      </div>
    );
  },
);
CardImage.displayName = 'CardImage';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cardTitle({ className })}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardSubtitle = React.forwardRef<HTMLDivElement, CardSubtitleProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cardSubtitle({ className })}
    {...props}
  />
));
CardSubtitle.displayName = 'CardSubtitle';

const CardTag = React.forwardRef<HTMLSpanElement, CardTagProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cardTag({ className })}
    {...props}
  />
));
CardTag.displayName = 'CardTag';

const CardAttributes = React.forwardRef<HTMLDivElement, CardAttributesProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cardAttributes({ className })}
    {...props}
  />
));
CardAttributes.displayName = 'CardAttributes';

const CardAttribute = React.forwardRef<HTMLSpanElement, CardAttributeProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cardAttribute({ className })}
    {...props}
  />
));
CardAttribute.displayName = 'CardAttribute';

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cardDescription({ className })}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/* Compose */
const ComposableCard = Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Image: CardImage,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Tag: CardTag,
  Attributes: CardAttributes,
  Attribute: CardAttribute,
  Description: CardDescription,
});

export { ComposableCard as Card };
