import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tarefas')
    .then(response => setTarefas(response.data))
    .catch(error => console.error(error)
    )}, []);

  return (
    <div className="App">
      <p></p>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <td>Id</td>
            <td>Descrição</td>
            <td>Data de Criação</td>
            <td>Data Prevista</td>
            <td>Data Encerramento</td>
            <td>Situação</td>
          </tr>
          {tarefas.map((tarefas) => (
            <tr>
              <td>{tarefas.id}</td>
              <td>{tarefas.descricao}</td>
              <td>{tarefas.data_criacao}</td>
              <td>{tarefas.data_prevista}</td>
              <td>{tarefas.data_encerramento}</td>
              <td>{tarefas.situacao}</td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
}

export default App;
