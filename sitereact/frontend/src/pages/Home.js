import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDate } from '../utils/formatDate';


function Home(){
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/tarefas`)
      .then(response => setTarefas(response.data))
      .catch(error => console.error(error)
      )}, []);

    return (
        <div className="container my-5 text-center">
          <h2 className="mb-4">Bem-vindo ao Gerenciador</h2>
          <p className="lead">Acompanhe suas tarefas de forma simples e visual</p>
    
          <div id="tarefasCarousel" className="carousel slide mt-5 w-75 mx-auto" data-bs-ride="carousel">
            <div className="carousel-inner">
              {tarefas.map((tarefa, index) => (
                <div
                  key={tarefa.id}
                  className={`carousel-item ${index === 0 ? 'active' : ''}`}
                >
                  <div className="card shadow p-4">
                    <h4 className="mb-3">{tarefa.descricao}</h4>
                    <p><strong>Data de Criação:</strong> {formatDate(tarefa.data_criacao)}</p>
                    <p><strong>Data Prevista:</strong> {formatDate(tarefa.data_prevista)}</p>
                    <p><strong>Data de Encerramento:</strong> {formatDate(tarefa.data_encerramento) || '---'}</p>
                    <p><strong>Situação:</strong> {tarefa.situacao}</p>
                  </div>
                </div>
              ))}
            </div>
    
            <button className="carousel-control-prev" type="button" data-bs-target="#tarefasCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#tarefasCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Próxima</span>
            </button>
          </div>
        </div>
      );
}

export default Home;