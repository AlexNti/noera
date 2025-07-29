'use client';

import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/*
 * Composable Card Component
 *
 * Usage Example:
 *
 * <Card variant="glass" interactive>
 *   <Card.Image
 *     src="image.jpg"
 *     alt="NFT"
 *     badge="#123"
 *   />
 *   <Card.Body>
 *     <Card.Title>NFT Name</Card.Title>
 *     <Card.Subtitle>
 *       <span>Contract Name</span>
 *       <Card.Tag>ERC-721</Card.Tag>
 *     </Card.Subtitle>
 *     <Card.Attributes>
 *       <Card.Attribute>Rarity: Legendary</Card.Attribute>
 *       <Card.Attribute>Level: 5</Card.Attribute>
 *     </Card.Attributes>
 *     <Card.Description>
 *       This is a beautiful NFT with amazing attributes...
 *     </Card.Description>
 *   </Card.Body>
 * </Card>
 */

const cardVariants = tv({
  base: 'rounded-xl border transition-all duration-300',
  variants: {
    variant: {
      default: 'bg-[var(--gradient-secondary)] hover:shadow-lg hover:scale-105',
      glass:
        'bg-gradient-to-br from-white/20 to-white/10 border-white/20 backdrop-blur-md hover:shadow-lg hover:scale-105',
      primary: 'bg-[var(--gradient-primary)] hover:shadow-lg hover:scale-105',
      secondary: 'bg-[var(--gradient-secondary)] hover:shadow-lg hover:scale-105',
      success: 'bg-[var(--gradient-success)] hover:shadow-lg hover:scale-105',
      warning: 'bg-[var(--gradient-warning)] hover:shadow-lg hover:scale-105',
      error: 'bg-[var(--gradient-accent)] hover:shadow-lg hover:scale-105',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
    interactive: {
      true: 'cursor-pointer group',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    interactive: false,
  },
});

export interface CardProps extends React.HTMLAttributes<any>, VariantProps<typeof cardVariants> {}

export interface CardHeaderProps extends React.HTMLAttributes<any> {}

export interface CardBodyProps extends React.HTMLAttributes<any> {}

export interface CardImageProps extends React.ImgHTMLAttributes<any> {
  placeholder?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<any> {}

export interface CardSubtitleProps extends React.HTMLAttributes<any> {}

export interface CardTagProps extends React.HTMLAttributes<any> {}

export interface CardAttributesProps extends React.HTMLAttributes<any> {}

export interface CardAttributeProps extends React.HTMLAttributes<any> {}

export interface CardDescriptionProps extends React.HTMLAttributes<any> {}

const Card = React.forwardRef<any, CardProps>(({ className, variant, size, interactive, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cardVariants({ variant, size, interactive, className })}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<any, CardHeaderProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`mb-3 ${className || ''}`}
      {...props}
    />
  );
});
CardHeader.displayName = 'CardHeader';

const CardBody = React.forwardRef<any, CardBodyProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`space-y-2 ${className || ''}`}
      {...props}
    />
  );
});
CardBody.displayName = 'CardBody';

const CardImage = React.forwardRef<any, CardImageProps>(({ className, placeholder, badge, onError, ...props }, ref) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = (e: React.SyntheticEvent<any>) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <div className='relative mb-3'>
      {!hasError && props.src ? (
        <img
          ref={ref}
          className={`h-32 w-full rounded-lg object-cover ${className || ''}`}
          onError={handleError}
          {...props}
        />
      ) : (
        <div className='flex h-32 w-full items-center justify-center rounded-lg bg-[var(--gradient-primary)]'>
          {placeholder || (
            <svg
              className='h-12 w-12 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
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
      {badge && (
        <div className='absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white'>{badge}</div>
      )}
    </div>
  );
});
CardImage.displayName = 'CardImage';

const CardTitle = React.forwardRef<any, CardTitleProps>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`truncate text-sm font-bold text-[var(--color-text-primary)] ${className || ''}`}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardSubtitle = React.forwardRef<any, CardSubtitleProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between text-xs text-[var(--color-text-secondary)] ${className || ''}`}
      {...props}
    />
  );
});
CardSubtitle.displayName = 'CardSubtitle';

const CardTag = React.forwardRef<any, CardTagProps>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`rounded-full bg-[var(--color-primary-glass)] px-2 py-1 text-xs font-medium text-[var(--color-primary)] ${className || ''}`}
      {...props}
    />
  );
});
CardTag.displayName = 'CardTag';

const CardAttributes = React.forwardRef<any, CardAttributesProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`mt-2 flex flex-wrap gap-1 ${className || ''}`}
      {...props}
    />
  );
});
CardAttributes.displayName = 'CardAttributes';

const CardAttribute = React.forwardRef<any, CardAttributeProps>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`rounded-full bg-[var(--color-neutral-glass)] px-2 py-1 text-xs text-[var(--color-text-secondary)] ${className || ''}`}
      {...props}
    />
  );
});
CardAttribute.displayName = 'CardAttribute';

const CardDescription = React.forwardRef<any, CardDescriptionProps>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`mt-2 line-clamp-2 text-xs text-[var(--color-text-secondary)] ${className || ''}`}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

// Compose the Card component with its sub-components
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
