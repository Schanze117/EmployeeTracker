import inquirer from 'inquirer';
import { Client } from 'pg';
const db = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'employee_db'
});
db.connect(err => {
    if (err)
        throw err;
    console.log('Connected to PostgreSQL database');
    startApp();
});
function startApp() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default: db.end();
        }
    });
}
function viewDepartments() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err)
            throw err;
        console.table(results.rows);
        startApp();
    });
}
function viewRoles() {
    db.query('SELECT * FROM role', (err, results) => {
        if (err)
            throw err;
        console.table(results.rows);
        startApp();
    });
}
function viewEmployees() {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err)
            throw err;
        console.table(results.rows);
        startApp();
    });
}
function addDepartment() {
    inquirer.prompt({ name: 'name', message: 'Enter department name:' }).then(answer => {
        db.query('INSERT INTO department (name) VALUES ($1)', [answer.name], err => {
            if (err)
                throw err;
            console.log('Department added');
            startApp();
        });
    });
}
function addRole() {
    inquirer.prompt([
        { name: 'title', message: 'Enter role title:' },
        { name: 'salary', message: 'Enter role salary:' },
        { name: 'department_id', message: 'Enter department ID:' }
    ]).then(answers => {
        db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], err => {
            if (err)
                throw err;
            console.log('Role added');
            startApp();
        });
    });
}
function addEmployee() {
    inquirer.prompt([
        { name: 'first_name', message: 'Enter employee first name:' },
        { name: 'last_name', message: 'Enter employee last name:' },
        { name: 'role_id', message: 'Enter role ID:' },
        { name: 'manager_id', message: 'Enter manager ID (or leave blank):' }
    ]).then(answers => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null], err => {
            if (err)
                throw err;
            console.log('Employee added');
            startApp();
        });
    });
}
function updateEmployeeRole() {
    inquirer.prompt([
        { name: 'employee_id', message: 'Enter employee ID to update:' },
        { name: 'role_id', message: 'Enter new role ID:' }
    ]).then(answers => {
        db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], err => {
            if (err)
                throw err;
            console.log('Employee role updated');
            startApp();
        });
    });
}
