const request = require('supertest');
const app = require('../../backend/server'); // Certifique-se de exportar o `app` no server.js
jest.mock('nodemailer');
const nodemailer = require('nodemailer');

test('POST /send-email - Deve enviar um e-mail', async () => {
    const mockSendMail = jest.fn();
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });

    const response = await request(app)
        .post('/send-email')
        .send({
            to: 'diogo.pavan@universo.univates.com.br',
            subject: 'Teste de e-mail',
            text: 'Este é um teste de envio de e-mail.',
        });

    expect(response.status).toBe(200);
    expect(mockSendMail).toHaveBeenCalled();
});