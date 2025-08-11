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
        dark: { name: 'Dark', value: '#333' },
        glassLight: { name: 'glassLight', value: 'var(--gradient-pastel-sunset)' },
        maroon: { name: 'Maroon', value: '#400' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'glassLight' },
  },
};

export default preview;
