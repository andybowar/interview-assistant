create table question_answer (
    id serial primary key,
    question varchar(2056) not null,
    answer varchar(8192) not null,
    created_at timestamp default now()
);
