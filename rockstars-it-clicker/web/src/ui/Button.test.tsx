import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders a button that defaults to type="button"', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('calls onClick when activated with the keyboard', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Commit</Button>);
    screen.getByRole('button', { name: 'Commit' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Buy
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Buy' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
