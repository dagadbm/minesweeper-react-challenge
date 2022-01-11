import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';


test('renders minesweeper', async () => {
  const user = userEvent.setup();

  render(<App />);

  expect(screen.getByText(/minesweeper/i)).toBeInTheDocument();
  // default size
  expect(screen.getAllByTestId(/square/)).toHaveLength(10*10);

  await user.clear(screen.getByLabelText(/width/i));
  await user.type(screen.getByLabelText(/width/i),'25');
  await user.clear(screen.getByLabelText(/height/i));
  await user.type(screen.getByLabelText(/height/i),'15');
  await user.clear(screen.getByLabelText(/mines/i));
  await user.type(screen.getByLabelText(/mines/i),'50');

  await user.click(screen.getByText(/start/i));
  expect(screen.getAllByTestId(/square/)).toHaveLength(25*15);
});

test('looses correctly', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.clear(screen.getByLabelText(/mines/i));
  await user.type(screen.getByLabelText(/mines/i),'300');

  await user.click(screen.getByText(/start/i));

  await user.click(screen.getAllByTestId(/square/i)[0]);
  expect(screen.getByText(/you lost/i));
});

test('wins correctly', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.clear(screen.getByLabelText(/mines/i));
  await user.type(screen.getByLabelText(/mines/i),'0');

  await user.click(screen.getByText(/start/i));

  await user.click(screen.getAllByTestId(/square/i)[0]);
  expect(screen.getByText(/you won/i));
});
