import { sendEmail } from '../utils/sendMail';
global.alert = jest.fn(); // Mock para o alert

test('Send email successfully', async () => {
    const to = 'diogo.pavan@universo.univates.br';
    const subject = 'Test Subject';
    const text = 'Test email body';

    await sendEmail(to, subject, text);

    expect(global.alert).toHaveBeenCalledWith('E-mail enviado com sucesso!');
});