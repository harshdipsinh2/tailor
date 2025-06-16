import { render, screen } from '@testing-library/react';
import App from './App';
import AppRoutes from "./Routes/Route"; // Import the routes



test('renders learn react link', () => {
  render(<AppRoutes />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
