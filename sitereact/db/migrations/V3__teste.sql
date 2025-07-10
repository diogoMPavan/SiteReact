CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT now()
);

INSERT INTO categoria (nome) VALUES ('Categoria 1'), ('Categoria 2');
