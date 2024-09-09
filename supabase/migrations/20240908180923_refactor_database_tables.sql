drop table public.question_and_answer;
drop table public.interview_question;

create table public.job_title (
    id serial primary key,
    job_title varchar(255) not null,
    user_uuid uuid not null references public.users(user_id),
    created_at timestamp default now()
);

create table public.interview_question (
    id serial primary key,
    question varchar(2056) not null,
    job_title_id bigint not null references public.job_title(id),
    created_at timestamp default now()
);

create table public.answer (
    id serial primary key,
    answer varchar(8192) not null,
    interview_question_id bigint not null references public.interview_question(id),
    created_at timestamp default now()
);
