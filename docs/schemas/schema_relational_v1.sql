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

create table laboratorista
(
    usuario_id bigint,
    foreign key (usuario_id) references usuario (id),
    primary key (usuario_id)
);

create table cliente
(
    usuario_id bigint,
    foreign key (usuario_id) references usuario (id),
    primary key (usuario_id)
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
    tipo_painel_id   bigint               not null,
    cliente_id       bigint               not null,
    laboratorista_id bigint               not null,
    estado_do_exame  estado_do_exame_tipo not null,
    foreign key (laboratorista_id) references laboratorista (usuario_id),
    foreign key (tipo_painel_id) references tipo_painel (id),
    foreign key (cliente_id) references cliente (usuario_id),
    primary key (tipo_painel_id, cliente_id)
);

create table painel
(
    tipo_painel_id               bigint not null,
    cliente_id                   bigint not null,
    sequencia_de_codigo_genetico text   not null,
    foreign key (tipo_painel_id, cliente_id) references exame (tipo_painel_id, cliente_id),
    primary key (tipo_painel_id, cliente_id)
);

create table condicao
(
    id            bigint not null,
    sequencia_dna text   not null,
    descricao     text   not null,
    nome          text   not null,
    primary key (id)
);

create table identifica_condicao
(
    tipo_painel_id bigint not null,
    cliente_id     bigint not null,
    condicao_id    bigint not null,
    foreign key (tipo_painel_id, cliente_id) references painel (tipo_painel_id, cliente_id),
    foreign key (condicao_id) references condicao (id),
    primary key (tipo_painel_id, cliente_id, condicao_id)
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
