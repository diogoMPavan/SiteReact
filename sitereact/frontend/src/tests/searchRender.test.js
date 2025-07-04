import { render, screen } from '@testing-library/react';
import Listing from '../pages/Listing';
import axios from 'axios';

jest.mock('axios');

test('Renderiza campo de busca por descrição', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  render(<Listing />);
  expect(await screen.findByPlaceholderText(/Buscar por descrição/i)).toBeInTheDocument();
});