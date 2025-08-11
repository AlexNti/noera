import type { Preview } from '@storybook/react-vite';
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
        glassLight: { name: 'glassLight', value: '#F7F9F2' },
        maroon: { name: 'Maroon', value: '#400' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'glassLight' },
  },
};

export default preview;
