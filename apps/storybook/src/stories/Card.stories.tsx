import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@noera/ui/card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'glass', 'primary', 'secondary', 'success', 'warning', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    interactive: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Card {...args}>
      <Card.Image
        src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
        alt='NFT Example'
        badge='#123'
      />
      <Card.Body>
        <Card.Title>Cosmic Explorer #123</Card.Title>
        <Card.Subtitle>
          <span>Cosmic Collection</span>
          <Card.Tag>ERC-721</Card.Tag>
        </Card.Subtitle>
        <Card.Attributes>
          <Card.Attribute>Rarity: Legendary</Card.Attribute>
          <Card.Attribute>Level: 5</Card.Attribute>
        </Card.Attributes>
        <Card.Description>
          A rare cosmic explorer NFT with extraordinary attributes and stunning visual design.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  args: {
    variant: 'default',
    size: 'md',
    interactive: false,
  },
};

export const Glass: Story = {
  render: args => (
    <Card {...args}>
      <Card.Image
        src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
        alt='NFT Example'
        badge='#123'
      />
      <Card.Body>
        <Card.Title>Cosmic Explorer #123</Card.Title>
        <Card.Subtitle>
          <span>Cosmic Collection</span>
          <Card.Tag>ERC-721</Card.Tag>
        </Card.Subtitle>
        <Card.Attributes>
          <Card.Attribute>Rarity: Legendary</Card.Attribute>
          <Card.Attribute>Level: 5</Card.Attribute>
        </Card.Attributes>
        <Card.Description>
          A rare cosmic explorer NFT with extraordinary attributes and stunning visual design.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  args: {
    variant: 'glass',
    size: 'md',
    interactive: true,
  },
};

export const Primary: Story = {
  render: args => (
    <Card {...args}>
      <Card.Image
        src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
        alt='NFT Example'
        badge='#123'
      />
      <Card.Body>
        <Card.Title>Cosmic Explorer #123</Card.Title>
        <Card.Subtitle>
          <span>Cosmic Collection</span>
          <Card.Tag>ERC-721</Card.Tag>
        </Card.Subtitle>
        <Card.Attributes>
          <Card.Attribute>Rarity: Legendary</Card.Attribute>
          <Card.Attribute>Level: 5</Card.Attribute>
        </Card.Attributes>
        <Card.Description>
          A rare cosmic explorer NFT with extraordinary attributes and stunning visual design.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  args: {
    variant: 'primary',
    size: 'md',
    interactive: true,
  },
};
