import type { Preview } from '@storybook/react-vite';
import '@noera/ui/theme.css';
import '../src/index.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
      codePanel: true,
    },
    backgrounds: {
      options: {
        primary: { name: 'primary', value: 'var(--gradient-primary)' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'primary' },
  },
};

export default preview;
