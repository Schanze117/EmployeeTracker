import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
await connectToDb();
// const db = new Client({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'password',
//   database: 'employee_db'
// });
// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to PostgreSQL database');
//   startApp();
// });
async function startApp() {
    try {
        const { action } = await inquirer.prompt([
            {
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
                    'Update an employee manager',
                    'View employees by manager',
                    'View employees by department',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'View total utilized budget by department',
                    'Exit'
                ],
            }
        ]);
        switch (action) {
            case 'View all departments':
                await viewDepartments();
                break;
            case 'View all roles':
                await viewRoles();
                break;
            case 'View all employees':
                await viewEmployees();
                break;
            case 'Add a department':
                await addDepartment();
                break;
            case 'Add a role':
                await addRole();
                break;
            case 'Add an employee':
                await addEmployee();
                break;
            case 'Update an employee role':
                await updateEmployeeRole();
                break;
            case 'Update an employee manager':
                await updateEmployeeManager();
                break;
            case 'View employees by manager':
                await viewEmployeesByManager();
                break;
            case 'View employees by department':
                await viewEmployeesByDepartment();
                break;
            case 'Delete a department':
                await deleteDepartment();
                break;
            case 'Delete a role':
                await deleteRole();
                break;
            case 'Delete an employee':
                await deleteEmployee();
                break;
            case 'View total utilized budget by department':
                await viewTotalBudgetByDepartment();
                break;
            case 'Exit':
                console.log('Goodbye!');
                await pool.end();
                return;
        }
        startApp();
    }
    catch (err) {
        console.error('ERROR:', err);
        startApp();
    }
}
async function viewDepartments() {
    try {
        const { rows } = await pool.query('SELECT * FROM department');
        console.table(rows);
    }
    catch (err) {
        console.error('ERROR viewing departments', err);
    }
}
async function viewRoles() {
    try {
        const { rows } = await pool.query(`
        SELECT
        r.id,
        r.title,
        d.name AS department,
        r.salary
        FROM role as r
        JOIN department as d 
        ON d.id = r.department_id
        order by r.id asc;
      `);
        console.table(rows);
    }
    catch (err) {
        console.error('ERROR viewing roles', err);
    }
}
async function viewEmployees() {
    try {
        const { rows } = await pool.query(`
        SELECT
        e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.name AS department,
        r.salary,
        concat(m.first_name, ' ', m.last_name) AS manager
        FROM employee as e
        LEFT JOIN role as r ON e.role_id = r.id
        LEFT JOIN department as d ON d.id = r.department_id
        LEFT JOIN employee as m ON m.id = e.manager_id
      `);
        console.table(rows);
    }
    catch (err) {
        console.error('ERROR viewing employees', err);
    }
}
async function addDepartment() {
    try {
        const { name } = await inquirer.prompt({ name: 'name', message: 'Enter department name:' });
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log('Department added');
    }
    catch (err) {
        console.error('ERROR adding department', err);
    }
}
async function addRole() {
    try {
        const { title, salary, department_id } = await inquirer.prompt([
            { name: 'title', message: 'Enter role title:' },
            { name: 'salary', message: 'Enter role salary:' },
            { name: 'department_id', message: 'Enter department ID:' }
        ]);
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log('Role added');
    }
    catch (err) {
        console.error('ERROR adding role', err);
    }
}
async function addEmployee() {
    try {
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
            { name: 'first_name', message: 'Enter employee first name:' },
            { name: 'last_name', message: 'Enter employee last name:' },
            { name: 'role_id', message: 'Enter role ID:' },
            { name: 'manager_id', message: 'Enter manager ID (or leave blank):' }
        ]);
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id || null]);
        console.log('Employee added');
    }
    catch (err) {
        console.error('ERROR adding employee', err);
    }
}
async function updateEmployeeRole() {
    try {
        const { employee_id, new_role_id } = await inquirer.prompt([
            { name: 'employee_id', message: 'Enter employee ID to update:' },
            { name: 'new_role_id', message: 'Enter new role ID:' }
        ]);
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id]);
        console.log('Employee role updated');
    }
    catch (err) {
        console.error('ERROR updating employee role', err);
    }
}
async function updateEmployeeManager() {
    try {
        const { employee_id, new_manager_id } = await inquirer.prompt([
            { name: 'employee_id', message: 'Enter employee ID to update:' },
            { name: 'new_manager_id', message: 'Enter new manager ID:' }
        ]);
        await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [new_manager_id, employee_id]);
        console.log('Employee manager updated');
    }
    catch (err) {
        console.error('ERROR updating employee manager', err);
    }
}
async function viewEmployeesByManager() {
    try {
        const { manager_id } = await inquirer.prompt({ name: 'manager_id', message: 'Enter manager ID:' });
        const { rows } = await pool.query('SELECT * FROM employee WHERE manager_id = $1', [manager_id]);
        console.table(rows);
    }
    catch (err) {
        console.error('ERROR viewing employees by manager', err);
    }
}
async function viewEmployeesByDepartment() {
    try {
        const { department_id } = await inquirer.prompt({ name: 'department_id', message: 'Enter department ID:' });
        const { rows } = await pool.query('SELECT * FROM employee WHERE department_id = $1', [department_id]);
        console.table(rows);
    }
    catch (err) {
        console.error('ERROR viewing employees by department', err);
    }
}
async function deleteDepartment() {
    try {
        const { department_id } = await inquirer.prompt({ name: 'department_id', message: 'Enter department ID to delete:' });
        await pool.query('DELETE FROM department WHERE id = $1', [department_id]);
        console.log('Department deleted');
    }
    catch (err) {
        console.error('ERROR deleting department', err);
    }
}
async function deleteRole() {
    try {
        const { role_id } = await inquirer.prompt({ name: 'role_id', message: 'Enter role ID to delete:' });
        await pool.query('DELETE FROM role WHERE id = $1', [role_id]);
        console.log('Role deleted');
    }
    catch (err) {
        console.error('ERROR deleting role', err);
    }
}
async function deleteEmployee() {
    try {
        const { employee_id } = await inquirer.prompt({ name: 'employee_id', message: 'Enter employee ID to delete:' });
        await pool.query('DELETE FROM employee WHERE id = $1', [employee_id]);
        console.log('Employee deleted');
    }
    catch (err) {
        console.error('ERROR deleting employee', err);
    }
}
async function viewTotalBudgetByDepartment() {
    try {
        const { rows } = await pool.query(`
          SELECT d.name AS department, SUM(r.salary) AS total_budget
          FROM department AS d
          JOIN role AS r ON d.id = r.department_id
          GROUP BY d.name
        `);
        console.table(rows);
    }
    catch (err) {
        console.error('ERROR viewing total budget by department', err);
    }
}
startApp();
