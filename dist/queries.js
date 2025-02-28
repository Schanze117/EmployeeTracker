import { pool } from './connection.js';
import inquirer from 'inquirer';
// This file contains all the queries used in the application that interact with the database
export const viewDepartments = async () => {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
};
export const viewRoles = async () => {
    const result = await pool.query('SELECT * FROM role');
    console.table(result.rows);
};
export const viewEmployees = async () => {
    const result = await pool.query('SELECT * FROM employee');
    console.table(result.rows);
};
export const addDepartment = async () => {
    const { name } = await inquirer.prompt({ name: 'name', message: 'Department name:' });
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log('Department added!');
};
export const addRole = async () => {
    const { title, salary, department_id } = await inquirer.prompt([
        { name: 'title', message: 'Role title:' },
        { name: 'salary', message: 'Role salary:' },
        { name: 'department_id', message: 'Department ID:' }
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log('Role added!');
};
export const addEmployee = async () => {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { name: 'first_name', message: 'First name:' },
        { name: 'last_name', message: 'Last name:' },
        { name: 'role_id', message: 'Role ID:' },
        { name: 'manager_id', message: 'Manager ID (or null):' }
    ]);
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id || null]);
    console.log('Employee added!');
};
export const updateEmployeeRole = async () => {
    const { employee_id, new_role_id } = await inquirer.prompt([
        { name: 'employee_id', message: 'Employee ID to update:' },
        { name: 'new_role_id', message: 'New role ID:' }
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id]);
    console.log('Employee role updated!');
};
export const updateEmployeeManager = async () => {
    const { employee_id, new_manager_id } = await inquirer.prompt([
        { name: 'employee_id', message: 'Employee ID to update:' },
        { name: 'new_manager_id', message: 'New manager ID:' }
    ]);
    await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [new_manager_id, employee_id]);
    console.log('Employee manager updated!');
};
export const viewEmployeesByManager = async () => {
    const { manager_id } = await inquirer.prompt({ name: 'manager_id', message: 'Manager ID:' });
    const result = await pool.query('SELECT * FROM employee WHERE manager_id = $1', [manager_id]);
    console.table(result.rows);
};
export const viewEmployeesByDepartment = async () => {
    const { department_id } = await inquirer.prompt({ name: 'department_id', message: 'Department ID:' });
    const result = await pool.query('SELECT * FROM employee WHERE department_id = $1', [department_id]);
    console.table(result.rows);
};
export const deleteDepartment = async () => {
    const { department_id } = await inquirer.prompt({ name: 'department_id', message: 'Department ID to delete:' });
    await pool.query('DELETE FROM department WHERE id = $1', [department_id]);
    console.log('Department deleted!');
};
export const deleteRole = async () => {
    const { role_id } = await inquirer.prompt({ name: 'role_id', message: 'Role ID to delete:' });
    await pool.query('DELETE FROM role WHERE id = $1', [role_id]);
    console.log('Role deleted!');
};
export const deleteEmployee = async () => {
    const { employee_id } = await inquirer.prompt({ name: 'employee_id', message: 'Employee ID to delete:' });
    await pool.query('DELETE FROM employee WHERE id = $1', [employee_id]);
    console.log('Employee deleted!');
};
export const viewUtilizedBudgetByDepartment = async () => {
    const result = await pool.query(`
    SELECT d.name AS department, SUM(r.salary) AS total_budget
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    GROUP BY d.name
  `);
    console.table(result.rows);
};
export { pool };
