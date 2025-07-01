INSERT INTO public.tarefas (descricao, data_criacao, data_prevista, data_encerramento, situacao, id) VALUES
('Oitava tarefa', '2025-03-05', '2025-03-05', '2025-03-06', 'Andamento', 8),
('Nona tarefa', '2025-03-01', '2025-03-01', '2025-03-02', 'Andamento', 9),
('Décima tarefa', '2025-05-20', '2025-05-13', NULL, 'Atrasada', 10),
('Terceira tarefa', '2025-03-18', '2025-03-18', '2025-03-18', 'Atrasada', 3),
('Quarta tarefa', '2025-03-15', '2025-03-15', '2025-03-15', 'Atrasada', 4),
('Quinta tarefa', '2025-03-12', '2025-03-12', '2025-03-13', 'Andamento', 5),
('Sexta tarefa', '2025-03-07', '2025-03-09', '2025-03-10', 'Andamento', 6),
('Sétima tarefa', '2025-03-02', '2025-03-02', '2025-03-05', 'Atrasada', 7),
('Segunda tarefa', '2025-03-10', '2025-03-10', '2025-03-10', 'Atrasada', 2),
('Primeira tarefa', '2025-03-27', '2025-03-27', '2025-03-27', 'Atrasada', 1);

INSERT INTO public.usuarios (id, username, password, email) VALUES
(2, 'user', 'senha123', 'pavandiogo531@gmail.com'),
(1, 'admin', '123456', 'diogo.pavan@universo.univates.br');
