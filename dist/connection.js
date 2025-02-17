import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Pool } from 'pg';
import inquirer from 'inquirer';
import { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } from '../dist/queries.js';
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});
const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database.');
    }
    catch (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
};
const actions = {
    'View all departments': viewDepartments,
    'View all roles': viewRoles,
    'View all employees': viewEmployees,
    'Add a department': addDepartment,
    'Add a role': addRole,
    'Add an employee': addEmployee,
    'Update an employee role': updateEmployeeRole,
    'Exit': () => pool.end()
};
const startApp = async () => {
    let exit = false;
    while (!exit) {
        const answer = await inquirer.prompt({
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
        });
        if (actions[answer.action]) {
            await actions[answer.action]();
        }
        else {
            console.error('Invalid action selected:', answer.action);
        }
        if (answer.action === 'Exit') {
            exit = true;
        }
    }
};
const main = async () => {
    await connectToDb();
    const PORT = process.env.PORT || 3001;
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use((_req, res) => {
        res.status(404).end();
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    startApp();
};
main();
export { pool, connectToDb };
