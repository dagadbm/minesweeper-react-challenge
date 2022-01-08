import { render, screen } from '@testing-library/react';
import App from './App';

test('renders minesweeper', () => {
  render(<App />);
  const linkElement = screen.getByText(/minesweeper/i);
  expect(linkElement).toBeInTheDocument();
});
