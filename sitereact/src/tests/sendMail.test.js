const { sendEmail } = require('../utils/sendMail');
const axios = require('axios');

jest.mock('axios');
global.alert = jest.fn();

test('Envia e-mail com sucesso', async () => {
  axios.post.mockResolvedValueOnce({ data: { message: 'E-mail enviado com sucesso!' } });
  await sendEmail('diogo.pavan@universo.univates.br', 'Assunto', 'Corpo');
  expect(global.alert).toHaveBeenCalledWith('E-mail enviado com sucesso!');
});