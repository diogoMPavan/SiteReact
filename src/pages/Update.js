import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDate } from '../utils/formatDate';
import { sendEmail } from '../utils/sendMail';

function Update() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tarefa, setTarefa] = useState({
        descricao: '',
        data_criacao: '',
        data_prevista: '',
        data_encerramento: '',
        situacao: ''
    });

    useEffect(() => {
        // Busca os dados da tarefa pelo ID
        if (id) {
            axios.get(`http://localhost:5000/tarefas/${id}`)
                .then(response => setTarefa(response.data))
                .catch(error => console.error('Erro ao buscar tarefa:', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTarefa({
            ...tarefa,
            [name]: value, // Atualiza apenas o campo que foi alterado
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const tarefaAtualizada = {
            ...tarefa,
            data_encerramento: tarefa.data_encerramento === '' ? null : tarefa.data_encerramento,
        };

        //valida data criação < prevista
        if (new Date(tarefa.data_criacao) > new Date(tarefa.data_prevista)) {
            alert('Data de criação não pode ser maior que a data prevista!');
            document.getElementById('data_criacao').focus();
            return;
        }

        if (id) {
            // update
            axios.put(`http://localhost:5000/tarefas/${id}`, tarefaAtualizada)
                .then(() => {
                    alert('Tarefa atualizada com sucesso!');
                    sendTaskEmail(tarefaAtualizada); // Envia o e-mail
                    navigate('/list'); // Redireciona para a lista de tarefas
                })
                .catch(error => console.error('Erro ao atualizar tarefa:', error));
        } else {
            //insert
            axios.post('http://localhost:5000/tarefas', tarefaAtualizada)
                .then(() => {
                    alert('Tarefa criada com sucesso!');
                    sendTaskEmail(tarefaAtualizada); // Envia o e-mail
                    navigate('/list'); // Redireciona para a lista de tarefas
                })
                .catch(error => console.error('Erro ao criar tarefa:', error));
        }
    };

    //envia email de tarefa atualizada ou criada
    const sendTaskEmail = async (tarefa) => {
        try {
            const user = localStorage.getItem('username');
            const response = await axios.get(`http://localhost:5000/user/${user}`);
            const email = response.data.email; // Acessa o e-mail retornado pelo backend

            const to = email;
            const subject = `Tarefa ${id ? 'Atualizada' : 'Criada'}`;
            const text = `A tarefa "${tarefa.descricao}" foi ${id ? 'atualizada' : 'criada'} com sucesso!`;

            await sendEmail(to, subject, text);

            // Envia o e-mail
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            alert('Erro ao enviar e-mail');
        }
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Editar Tarefa</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">Descrição</label>
                    <input
                        type="text"
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        value={tarefa.descricao}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="data_criacao" className="form-label">Data de Criação</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data_criacao"
                        name="data_criacao"
                        value={formatDate(tarefa.data_criacao)}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="data_prevista" className="form-label">Data Prevista</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data_prevista"
                        name="data_prevista"
                        value={formatDate(tarefa.data_prevista)}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="data_encerramento" className="form-label">Data de Encerramento</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data_encerramento"
                        name="data_encerramento"
                        value={formatDate(tarefa.data_encerramento) || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="situacao" className="form-label">Situação</label>
                    <select
                        className="form-control"
                        id="situacao"
                        name="situacao"
                        value={tarefa.situacao}
                        onChange={handleChange}
                        required
                    >
                        <option value=""></option>
                        <option value="Atrasada">Atrasada</option>
                        <option value="Andamento">Andamento</option>
                        <option value="Finalizada">Finalizada</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    {id ? 'Atualizar' : 'Criar'}
                </button>
            </form >
        </div>
    );
}

export default Update;