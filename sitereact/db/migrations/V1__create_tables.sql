CREATE SEQUENCE IF NOT EXISTS tarefas_id_seq;
CREATE SEQUENCE IF NOT EXISTS usuarios_id_seq;

CREATE TABLE IF NOT EXISTS public.tarefas
(
    descricao character varying(100),
    data_criacao date,
    data_prevista date,
    data_encerramento date,
    situacao character varying(10),
    id integer NOT NULL DEFAULT nextval('tarefas_id_seq'),
    CONSTRAINT tarefas_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuarios
(
    id integer NOT NULL DEFAULT nextval('usuarios_id_seq'),
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100),
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_username_key UNIQUE (username)
);