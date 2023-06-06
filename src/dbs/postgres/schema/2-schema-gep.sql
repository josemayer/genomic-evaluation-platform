-- DDL v0.0.1

create table usuario
(
    id            bigint not null,
    nome_completo text   not null,
    email         text   not null,
    senha         text   not null,
    primary key (id)
);

create table administrador
(
    usuario_id bigint,
    foreign key (usuario_id) references usuario (id),
    primary key (usuario_id)
);

create table laborista
(
    usuario_id bigint,
    numero_identificacao bigint,
    foreign key (usuario_id) references usuario (id),
    primary key (usuario_id)
);

create table cliente
(
    usuario_id bigint,
    telefone varchar(20),
    foreign key (usuario_id) references usuario (id),
    primary key (usuario_id)
);

create table medico
(
    usuario_id bigint,
    registro_crm bigint,
    foreign key (usuario_id) references usuario (id),
    primary key (usuario_id)
);


create table coleta
(
    id bigint,
    cliente_id bigint not null,
    tipo_painel_id bigint not null,
    data timestamp not null,

    primary key (id),
    foreign key (cliente_id) references cliente (usuario_id),
    foreign key (tipo_painel_id) references tipo_painel (id)
);

create table tipo_painel
(
    id        bigint,
    descricao text,

    primary key (id)
);

create type estado_do_exame_tipo as enum ('na fila', 'processando', 'completo', 'invalido');

create table exame
(
    id               bigint,
    painel_id        bigint               not null,
    cliente_id       bigint               not null,
    coleta_id        bigint               not null,
    tempo_estimado   interval             not null,

    foreign key (painel_id) references painel (id),
    foreign key (cliente_id) references cliente (usuario_id),
    foreign key (coleta_id) references coleta (id),
    primary key (id)
);

create table painel
(
    exame_id bigint not null,
    tipo_painel_id               bigint not null,
    sequencia_de_codigo_genetico text   not null,
    foreign key (exame_id) references exame (id),
    foreign key (tipo_painel_id) references tipo_painel (id),
    primary key (exame_id, tipo_painel_id)
);


create table condicao
(
    id            bigint not null,
    descricao     text   not null,
    nome          text   not null,
    condicao_id  bigint not null,
    prob_pop      float  not null,

    primary key (id),
    foreign key (condicao_id) references condicao (id)
);

--- attr multivalorado de condicao
create table condicao_sequencia_dna
(
    condicao_id bigint not null,
    sequencia_dna text not null,
    prob_seq float not null,
    prob_seq_dado_cond float not null,

    foreign key (condicao_id) references condicao (id),
    primary key (condicao_id, sequencia_dna)
);

create table identifica_condicao
(
    tipo_painel_id bigint not null,
    exame_id bigint not null,

    foreign key (exame_id, tipo_painel_id) references exame (exame_id, tipo_painel_id),
    foreign key (condicao_id) references condicao (id),
    primary key (exame_id, tipo_painel_id, condicao_id)
);

create table notificacao
(
    id          bigint not null,
    usuario_id  bigint not null,
    data        date   not null,
    visualizado bool default false,
    texto       text   not null,
    foreign key (usuario_id) references usuario (id),
    primary key (id)
);


--- ===========


