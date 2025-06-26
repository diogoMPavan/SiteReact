import { render, screen, fireEvent } from '@testing-library/react';
import Listing from '../pages/Listing';
import axios from 'axios';

jest.mock('axios');

test('Filtra tarefas por descrição', async () => {
  const tarefasMock = [
    { id: 1, descricao: 'Primeira tarefa', situacao: 'Finalizada' },
    { id: 2, descricao: 'Segunda tarefa', situacao: 'Atrasada' },
  ];
  axios.get.mockResolvedValueOnce({ data: tarefasMock });

  render(<Listing />);
  expect(await screen.findByText(/Primeira tarefa/i)).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Buscar por descrição...'), { target: { value: 'Primeira' } });
  expect(screen.getAllByText(/Primeira/i).length).toBe(1);
});