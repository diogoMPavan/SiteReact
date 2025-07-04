import { render, screen } from '@testing-library/react';
import Listing from '../pages/Listing';
import axios from 'axios';

jest.mock('axios');

test('Renderiza botão de exportar para CSV', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  render(<Listing />);
  expect(await screen.findByText(/Exportar para CSV/i)).toBeInTheDocument();
});