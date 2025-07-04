import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';

function Listing() {
    const [tarefas, setTarefas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/tarefas`)
            .then(response => setTarefas(response.data))
            .catch(error => console.error(error));
    }, []);

    const exportToCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8," + tarefas.map(tarefa => {
            return `${tarefa.id},${tarefa.descricao},${formatDate(tarefa.data_criacao)},${formatDate(tarefa.data_prevista)},${formatDate(tarefa.data_encerramento)},${tarefa.situacao}`;
        }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tarefas.csv");
        document.body.appendChild(link);
        link.click();
    };

    const filteredTarefas = tarefas.filter((tarefa) => {
        const matchesSearch = tarefa.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? tarefa.situacao === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Lista de Tarefas</h2>

            <div className="mb-3 d-flex justify-content-between">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="form-control"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Todos os Status</option>
                    <option value="Atrasada">Atrasada</option>
                    <option value="Andamento">Andamento</option>
                    <option value="Finalizada">Finalizada</option>
                </select>
            </div>

            <button className="btn btn-dark mb-3" onClick={exportToCsv} >Exportar para CSV</button>
            <table className="table table-hover table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Id</th>
                        <th>Descrição</th>
                        <th>Data de Criação</th>
                        <th>Data Prevista</th>
                        <th>Data Encerramento</th>
                        <th>Situação</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTarefas.map((tarefa) => (
                        <tr key={tarefa.id}>
                            <td>{tarefa.id}</td>
                            <td>{tarefa.descricao}</td>
                            <td>{formatDate(tarefa.data_criacao)}</td>
                            <td>{formatDate(tarefa.data_prevista)}</td>
                            <td>{formatDate(tarefa.data_encerramento)}</td>
                            <td>{tarefa.situacao}</td>
                            <td className="text-center">
                                <a className="btn btn-warning btn-sm me-2" href={`/update/${tarefa.id}`} >Editar</a>
                                <a className="btn btn-danger btn-sm" href={`/delete/${tarefa.id}`}>Deletar</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Listing;
