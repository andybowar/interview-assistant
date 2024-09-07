create table public.interview_question (
    id serial primary key,
    job_title varchar(255) not null,
    question varchar(2056) not null,
    created_at timestamp default now()
);

alter table public.question_and_answer
drop column job_title;

alter table public.question_and_answer
drop column question;

alter table public.question_and_answer
add column question bigint references public.interview_question(id);
