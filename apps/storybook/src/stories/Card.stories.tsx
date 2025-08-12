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
    appearance: {
      control: { type: 'select' },
      options: ['glass', 'solid'],
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
    appearance: 'solid',
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
    appearance: 'glass',
    size: 'md',
    interactive: true,
  },
};

export const Interactive: Story = {
  render: args => (
    <Card {...args}>
      <Card.Image
        src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
        alt='NFT Example'
        badge='#123'
      />
      <Card.Body>
        <Card.Title>Interactive Card</Card.Title>
        <Card.Subtitle>
          <span>Cosmic Collection</span>
          <Card.Tag>ERC-721</Card.Tag>
        </Card.Subtitle>
        <Card.Attributes>
          <Card.Attribute>Rarity: Legendary</Card.Attribute>
          <Card.Attribute>Level: 5</Card.Attribute>
        </Card.Attributes>
        <Card.Description>An interactive card that responds to hover and click events.</Card.Description>
      </Card.Body>
    </Card>
  ),
  args: {
    appearance: 'solid',
    size: 'md',
    interactive: true,
  },
};

export const AllAppearances: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-4'>
      {['glass', 'solid'].map(appearance => (
        <Card
          key={appearance}
          appearance={appearance as any}
          size='md'
        >
          <Card.Body>
            <Card.Title>{appearance} appearance</Card.Title>
            <Card.Description>This card uses the {appearance} appearance style</Card.Description>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};
