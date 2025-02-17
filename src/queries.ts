import { pool } from '../src/connection.js';
import inquirer from 'inquirer';

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