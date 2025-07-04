import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import axios from 'axios';

jest.mock('axios');

test('Renderiza o título da Home', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  render(<Home />);
  expect(await screen.findByText(/Bem-vindo ao Gerenciador de Tarefas/i)).toBeInTheDocument();
});