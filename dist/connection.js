import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
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
// const main = async () => {
//   await connectToDb();
//   const PORT = process.env.PORT || 3001;
//   const app = express();
//   app.use(express.urlencoded({ extended: false }));
//   app.use(express.json());
//   app.use((_req, res) => {
//     res.status(404).end();
//   });
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }
// main();
export { pool, connectToDb };
