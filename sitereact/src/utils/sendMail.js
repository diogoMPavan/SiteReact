const axios = require('axios');

/**
 * @param {string} to 
 * @param {string} subject
 * @param {string} text 
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    const emailData = { to, subject, text };
    const response = await axios.post('http://localhost:5000/send-email', emailData);
    alert(response.data.message);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    alert('Erro ao enviar e-mail');
  }
};

module.exports = { sendEmail };