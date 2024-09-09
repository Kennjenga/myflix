import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,  // adjust the limit based on your needs
  queueLimit: 0
});

pool.on('connection', (connection) => {
  console.log('A new connection was made with the ID', connection.threadId);
});

pool.on('error', (err) => {
  console.error('MySQL Pool error:', err);
});

export default pool;