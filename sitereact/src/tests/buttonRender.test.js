import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

test('Renderiza botão de entrar na tela de login', () => {
  render(<Login />);
  expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
});