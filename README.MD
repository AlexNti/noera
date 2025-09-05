# Escrow Monorepo

A Turborepo-powered monorepo for web3 escrow applications with co-located Storybook stories and optimized caching.

## 📁 Project Structure

```
escrow/
├── apps/
│   ├── fe/                    # Next.js frontend application
│   ├── storybook/            # Storybook app (co-located stories)
│   └── mobile/               # Mobile application
├── packages/
│   ├── ui/                   # Design system with co-located stories
│   │   └── src/components/card/
│   │       ├── Card.tsx      # Component
│   │       └── Card.stories.tsx  # Co-located story
│   ├── contracts/            # Smart contracts (Hardhat)
│   └── eslint-config/        # Shared ESLint configuration
└── turbo.json               # Turborepo configuration
```

## 🚀 Build Process & Caching Strategy

This project uses **Turborepo** with **optimized caching** for different build scenarios:

### Development Commands

```bash
# Start all development servers
turbo dev

# Start specific applications
pnpm storybook          # Storybook dev server (localhost:6006)
cd apps/fe && pnpm dev  # Frontend dev server
```

### Production Builds

```bash
# Build production applications (excludes stories from cache)
turbo build

# Build Storybook documentation (includes stories in cache)
turbo build:storybook

# Build everything
turbo build:storybook build
```

### 🎯 Caching Optimization

Our build process uses **smart caching** to optimize build times:

#### `turbo build` (Production Apps)

- **Excludes**: `**/*.stories.{tsx,jsx,mdx}` from input hash
- **Result**: Story changes don't trigger unnecessary app rebuilds
- **Runs**: Frontend, UI library, contracts (packages with `build` scripts)

#### `turbo build:storybook` (Documentation)

- **Includes**: Story files in input hash
- **Result**: Story changes trigger Storybook rebuilds
- **Runs**: Only Storybook (packages with `build:storybook` scripts)

### 📖 Story Co-location

Stories live **next to their components** for better maintainability:

```
packages/ui/src/components/card/
├── Card.tsx           # Component implementation
└── Card.stories.tsx   # Storybook stories (co-located)
```

**Benefits:**

- ✅ Stories stay in sync with components
- ✅ Easier to maintain and update
- ✅ Optimal caching (stories only affect Storybook builds)
- ✅ Better developer experience

### 🏗️ Build Configuration

#### Root `turbo.json`

```json
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "!**/*.stories.{tsx,jsx,mdx}"],
      "outputs": [".next/**", "dist/**"]
    },
    "build:storybook": {}
  }
}
```

#### Package-specific `apps/storybook/turbo.json`

```json
{
  "extends": ["//"],
  "tasks": {
    "build:storybook": {
      "dependsOn": ["^build:storybook"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

### 📦 Package Scripts

Each package has targeted scripts:

```json
// apps/storybook/package.json
{
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build:storybook": "storybook build"
  }
}

// packages/ui/package.json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

## 🛠️ Development Workflow

1. **Start development**: `turbo dev`
2. **Edit components**: Changes auto-reload in Storybook
3. **Edit stories**: Only Storybook rebuilds (optimal caching)
4. **Build for production**: `turbo build` (excludes stories)
5. **Deploy Storybook**: `turbo build:storybook` (includes stories)

## 📚 Tools & Dependencies

### Monorepo Management

- **Turborepo**: Build system and caching
- **pnpm**: Package manager with workspace support

### UI Development

- **Storybook**: Component development and documentation
- **Tailwind CSS v4**: Utility-first CSS framework
- **tailwind-variants**: Component variant management

### Recommended Tools to Explore

Check https://www.npmjs.com/package/syncpack or https://www.npmjs.com/package/@manypkg/cli or https://www.npmjs.com/package/sherif

This packages are helping keep the same version of deps everywhere

Explore typedoc to include on our functions or components.
Explore commitlint
Explore husky and lint-staged
look at https://styledictionary.com/info/tokens/

To check if the style of tailwnd are inside
grep -n "bg-lavender-300\|lavender-300" apps/fe/.next/static/css/\*.css
grep -o "bg-lavender-[0-9]\+" apps/fe/.next/static/css/\*.css | sort -u
/_ Dark mode remap (keeps the same token names, adjusts values) _/
{{/* @media (prefers-color-scheme: dark) {
  :root { */}}
{{/* --color-surface: oklch(20% 0.02 270);
    --color-surface-muted: oklch(24% 0.02 270);
    --color-surface-inset: oklch(28% 0.02 270); */}}

    {{/* --color-fg: oklch(96% 0.01 270);
    --color-fg-muted: oklch(82% 0.01 270);
    --color-fg-inverse: oklch(12% 0 0); */}}

    {{/* --color-border: oklch(35% 0.01 270);
    --color-border-strong: oklch(42% 0.01 270); */}}

    {{/* --color-accent: oklch(70% 0.12 280);
    --color-accent-foreground: oklch(16% 0.02 270); */}}

    /* stronger shadow feel on dark */
    {{/* --shadow-1: 0 1px 2px oklch(0% 0 0 / 0.6), 0 1px 1px oklch(0% 0 0 / 0.6);
    --shadow-2: 0 4px 12px oklch(0% 0 0 / 0.6);
    --shadow-3: 0 8px 32px oklch(0% 0 0 / 0.6); */}}

{{/* }
} */}}
