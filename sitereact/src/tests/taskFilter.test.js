import { render, screen, fireEvent } from '@testing-library/react';
import Listing from '../pages/Listing';
import axios from 'axios';

jest.mock('axios');

test('Filter tasks test', async () => {
    const taskMock = [
        { id: 1, descricao: 'Primeira tarefa', situacao: 'Finalizada' },
        { id: 2, descricao: 'Segunda tarefa', situacao: 'Atrasada' },
    ];

    axios.get.mockResolvedValueOnce({ data: taskMock });

    render(<Listing />);

    // Aguarde os dados serem carregados
    expect(await screen.findByText(/Primeira tarefa/i)).toBeInTheDocument();

    // Simula o filtro
    fireEvent.change(screen.getByPlaceholderText('Buscar por descrição...'), { target: { value: 'Primeira' } });

    const filtered = screen.getAllByText(/Primeira/i);
    expect(filtered.length).toBe(1);
});