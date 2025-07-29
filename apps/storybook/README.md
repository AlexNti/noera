# Storybook App

This is a Storybook application that showcases the UI components from the `@noera/ui` package.

## Setup

The Storybook app is configured to use the latest Storybook version (9.0.18) and is set up to consume components from the UI package.

## Features

- **Latest Storybook**: Uses Storybook 9.0.18 with React and Vite
- **UI Package Integration**: Imports and displays components from `@noera/ui`
- **Dark Theme**: Configured with dark background by default
- **Component Documentation**: Auto-generated documentation for components

## Available Components

### Card Component

The Card component is a composable UI element with the following features:

- **Variants**: default, glass, primary, secondary, success, warning, error
- **Sizes**: sm, md, lg
- **Interactive**: Hover effects and cursor changes
- **Sub-components**: Image, Body, Title, Subtitle, Tag, Attributes, Description

#### Usage Example

```tsx
import { Card } from '@noera/ui/card';

<Card
  variant='glass'
  interactive
>
  <Card.Image
    src='image.jpg'
    alt='NFT'
    badge='#123'
  />
  <Card.Body>
    <Card.Title>NFT Name</Card.Title>
    <Card.Subtitle>
      <span>Contract Name</span>
      <Card.Tag>ERC-721</Card.Tag>
    </Card.Subtitle>
    <Card.Attributes>
      <Card.Attribute>Rarity: Legendary</Card.Attribute>
      <Card.Attribute>Level: 5</Card.Attribute>
    </Card.Attributes>
    <Card.Description>This is a beautiful NFT with amazing attributes...</Card.Description>
  </Card.Body>
</Card>;
```

## Development

### Running Storybook

```bash
pnpm storybook
```

This will start Storybook on `http://localhost:6006`

### Building Storybook

```bash
pnpm build-storybook
```

### Adding New Components

1. Create a new story file in `src/stories/`
2. Import the component from `@noera/ui`
3. Create stories with different variants and props
4. Add proper TypeScript types and documentation

## Configuration

- **Vite Config**: Configured with path aliases for the UI package
- **Theme**: Imports the UI theme CSS for consistent styling
- **Backgrounds**: Dark theme by default with light option available

## Dependencies

- Storybook 9.0.18
- React 19
- Vite
- TypeScript
- UI Package (`@noera/ui`)
