import { render, screen } from '@testing-library/react';
import ConfirmDelete from '../pages/ConfirmDelete';

test('Renderiza botões de Confirmar e Cancelar na tela de confirmação de exclusão', () => {
  render(<ConfirmDelete />);
  expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
});