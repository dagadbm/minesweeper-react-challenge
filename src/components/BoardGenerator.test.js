import { render, screen } from '@testing-library/react';
import { BoardGenerator } from './BoardGenerator';

test('renders correct number of mines and squares', () => {
  render(<BoardGenerator mines={20} size={10} />);
  expect(screen.getByTestId('board')).toBeInTheDocument();
  expect(screen.getAllByTestId('mine')).toHaveLength(20);
  expect(screen.getAllByTestId(/square/)).toHaveLength(10*10);
});
