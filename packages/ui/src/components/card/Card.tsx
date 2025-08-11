'use client';

import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Glassmorphism Card with tone-aware glass variants
 * - appearance: 'glass' or 'solid'
 * - tone: 'default' | semantic tones (primary, warning, error, etc.)
 * - polished hover/elevation + focus-visible a11y
 */

export const cardVariants = tv({
  base: [
    'relative isolate overflow-hidden rounded-2xl border',
    'transition-all duration-300 ease-out',
    'transform-gpu outline-none [backface-visibility:hidden]',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0',
    'will-change-[transform,box-shadow,backdrop-filter]',
  ],
  variants: {
    appearance: {
      glass: [
        // core glass
        'bg-white/10 dark:bg-white/5',
        'backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/10',
        'shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
        'border-white/20 ring-1 ring-white/10',
        // subtle inner highlight + glossy edge
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-['']",
        'before:bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.35),rgba(255,255,255,0.08)_45%,transparent_60%)]',
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
        'after:bg-[linear-gradient(135deg,rgba(255,255,255,0.35),rgba(255,255,255,0.12)_35%,transparent_60%)] after:opacity-70 after:mix-blend-overlay',
      ],
      solid: [
        'bg-white/85 dark:bg-white/10',
        'border-black/10 dark:border-white/10',
        'shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
      ],
    },
    tone: {
      default: '', // handled in compound or base
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      error: '',
      info: '',
      neutral: '',
    },
    size: {
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    },
    elevation: {
      none: '',
      sm: 'shadow-[0_6px_20px_rgba(0,0,0,0.10)]',
      md: 'shadow-[0_12px_36px_rgba(0,0,0,0.12)]',
      lg: 'shadow-[0_16px_56px_rgba(0,0,0,0.16)]',
    },
    hover: {
      none: '',
      lift: 'hover:-translate-y-0.5',
      scale: 'hover:scale-[1.015] hover:shadow-[0_16px_60px_rgba(0,0,0,0.18)]',
      glow: 'hover:[box-shadow:0_0_0_1px_rgba(255,255,255,0.25),0_20px_80px_rgba(0,0,0,0.20)]',
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
    // GLASS + tones (use your glass gradients + colored glass rings)
    {
      appearance: 'glass',
      tone: 'primary',
      class: [
        'bg-[var(--gradient-primary-glass)] text-[var(--color-text-primary)]',
        'ring-[var(--color-primary-glass)]',
      ],
    },
    {
      appearance: 'glass',
      tone: 'secondary',
      class: [
        'bg-[var(--gradient-secondary-glass)] text-[var(--color-text-primary)]',
        'ring-[var(--color-secondary-glass)]',
      ],
    },
    {
      appearance: 'glass',
      tone: 'success',
      class: [
        'bg-[var(--gradient-success-glass)] text-[var(--color-text-primary)]',
        'ring-[var(--color-success-glass)]',
      ],
    },
    {
      appearance: 'glass',
      tone: 'warning',
      class: [
        'bg-[var(--gradient-warning-glass)] text-[var(--color-text-primary)]',
        'ring-[var(--color-warning-glass)]',
      ],
    },
    {
      appearance: 'glass',
      tone: 'error',
      class: ['bg-[var(--gradient-accent-glass)] text-[var(--color-text-primary)]', 'ring-[var(--color-accent-glass)]'],
    },
    {
      appearance: 'glass',
      tone: 'info',
      class: ['bg-[var(--color-info-glass)] text-[var(--color-text-primary)]', 'ring-[var(--color-info-glass)]'],
    },
    {
      appearance: 'glass',
      tone: 'neutral',
      class: ['bg-[var(--color-neutral-glass)] text-[var(--color-text-primary)]', 'ring-[var(--color-neutral-glass)]'],
    },

    // SOLID + tones (normal gradients; still a bit glass-adjacent with soft shadow)
    {
      appearance: 'solid',
      tone: 'primary',
      class: 'border-transparent bg-[var(--gradient-primary)] text-[var(--color-text-inverse)]',
    },
    {
      appearance: 'solid',
      tone: 'secondary',
      class: 'border-transparent bg-[var(--gradient-secondary)] text-[var(--color-text-inverse)]',
    },
    {
      appearance: 'solid',
      tone: 'success',
      class: 'border-transparent bg-[var(--gradient-success)] text-[var(--color-text-inverse)]',
    },
    {
      appearance: 'solid',
      tone: 'warning',
      class: 'border-transparent bg-[var(--gradient-warning)] text-[var(--color-text-primary)]',
    },
    {
      appearance: 'solid',
      tone: 'error',
      class: 'border-transparent bg-[var(--gradient-accent)] text-[var(--color-text-inverse)]',
    },

    // Slightly brighten glass on hover when interactive
    {
      appearance: 'glass',
      interactive: true,
      class: ['hover:bg-white/12 dark:hover:bg-white/7', 'hover:backdrop-blur-2xl'],
    },
  ],
  defaultVariants: {
    appearance: 'glass',
    tone: 'default',
    size: 'md',
    elevation: 'md',
    hover: 'lift',
    interactive: false,
    disabled: false,
  },
});

// Subcomponent builders (all TV, no joins)
const cardHeader = tv({ base: 'mb-3' });
const cardBody = tv({ base: 'space-y-2' });

const cardImage = tv({
  base: ['relative mb-3 overflow-hidden rounded-xl ring-1 ring-white/10'],
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
  base: 'absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm',
});

const cardTitle = tv({ base: 'truncate text-sm font-bold text-[var(--color-text-primary)]' });
const cardSubtitle = tv({ base: 'flex items-center justify-between text-xs text-[var(--color-text-secondary)]' });

const cardTag = tv({
  base: ['rounded-full px-2 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur-sm'],
  variants: {
    tone: {
      primary: 'bg-[var(--color-primary-glass)] text-[var(--color-primary)]',
      secondary: 'bg-[var(--color-secondary-glass)] text-[var(--color-secondary)]',
      success: 'bg-[var(--color-success-glass)] text-[var(--color-success)]',
      warning: 'bg-[var(--color-warning-glass)] text-[var(--color-warning)]',
      error: 'bg-[var(--color-error-glass)] text-[var(--color-error)]',
      info: 'bg-[var(--color-info-glass)] text-[var(--color-info)]',
      neutral: 'bg-[var(--color-neutral-glass)] text-[var(--color-neutral)]',
      default: 'bg-[var(--color-primary-glass)] text-[var(--color-primary)]',
    },
  },
  defaultVariants: { tone: 'default' },
});

const cardAttributes = tv({ base: 'mt-2 flex flex-wrap gap-1' });
const cardAttribute = tv({
  base: 'rounded-full bg-[var(--color-neutral-glass)] px-2 py-1 text-xs text-[var(--color-text-secondary)] ring-1 ring-white/10 backdrop-blur-sm',
});
const cardDescription = tv({ base: 'mt-2 line-clamp-2 text-xs text-[var(--color-text-secondary)]' });

/* Types */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof cardImage> {
  placeholder?: React.ReactNode;
  badge?: React.ReactNode;
}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardSubtitleProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof cardTag> {}
export interface CardAttributesProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardAttributeProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/* Components */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, appearance, tone, size, elevation, hover, interactive, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ appearance, tone, size, elevation, hover, interactive, disabled, className })}
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

const CardTag = React.forwardRef<HTMLSpanElement, CardTagProps>(({ className, tone, ...props }, ref) => (
  <span
    ref={ref}
    className={cardTag({ tone, className })}
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

// Compose
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
