INSERT INTO departments (name) 
VALUES ('Engineering'),
       ('Finance'),
       ('Sales'),
       ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('Project Manager', 140000, 1),
       ('Lead Engineer', 120000, 1),
       ('Software Engineer', 100000, 1)
       ('Accountant', 80000, 2),
       ('Salesperson', 60000, 3),
       ('Sales Lead', 75000, 3);
       ('Lawyer', 95000, 4),

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Alice', 'Johnson', 1, NULL),
       ('Bob', 'Smith', 2, 1),
       ('Charlie', 'Brown', 2, 1),
       ('Nina', 'Parker', 6, 1),
       ('Judy', 'Lopez', 5, 2),
       ('Kevin', 'Harris', 5, 2),
       ('David', 'Jones', 3, 2),
       ('Eve', 'Williams', 3, 2);
       ('Frank', 'Miller', 3, 2),
       ('Grace', 'Davis', 3, 3),
       ('Heidi', 'Young', 3, 3),
       ('Ivan', 'King', 3, 3),
       ('Larry', 'Nelson', 4, 1),
       ('Molly', 'Olson', 4, 1),
       ('Nancy', 'Perez', 6, NULL),
      