CREATE TABLE novosdados (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT now()
);

INSERT INTO novosdados (nome) VALUES ('Registro 1'), ('Registro 2');
