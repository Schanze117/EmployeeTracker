INSERT INTO departments (name) 
VALUES ('Engineering'),
       ('Finance'),
       ('Sales'),
       ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1)
       ('Lead Engineer', 120000, 1),
       ('Accountant', 80000, 2),
       ('Lawyer', 95000, 2),
       ('Salesperson', 60000, 3),
       ('Sales Lead', 75000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Alice', 'Johnson', 1, NULL),
       ('Bob', 'Smith', 1, 1),
       ('Charlie', 'Brown', 1, 1),
       ('David', 'Jones', 1, 3),
       ('Eve', 'Williams', 1, 3);