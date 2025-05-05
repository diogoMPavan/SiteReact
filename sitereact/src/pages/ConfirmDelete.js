import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ConfirmDelete() {
  const { id } = useParams(); // Obtém o ID da tarefa a partir da URL
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tarefas/${id}`); // Chama a API de exclusão
      alert('Tarefa deletada com sucesso!');
      navigate('/list'); // Redireciona para a tela de listagem
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      alert('Ocorreu um erro ao tentar deletar a tarefa.');
    }
  };

  const handleCancel = () => {
    navigate('/list'); // Redireciona para a tela de listagem
  };

  return (
    <div className="container text-center my-5">
      <h2 className="text-danger mb-4">Você deseja deletar esta tarefa?</h2>
      <div>
        <button className="btn btn-danger me-3" onClick={handleDelete}>
          Confirmar
        </button>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ConfirmDelete;