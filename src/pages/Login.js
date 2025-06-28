import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useAuth(); // Importa a função login do contexto
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      alert(response.data.message);
      login(); // Atualiza o estado de autenticação
      localStorage.setItem('username', formData.username); // Armazena o nome de usuário no localStorage
      navigate('/'); // Redireciona para a página de listagem
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuário</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  );
}

export default Login;