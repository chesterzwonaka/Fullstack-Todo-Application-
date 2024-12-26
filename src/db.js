import sqlite3 from 'sqlite3';

// Create an in-memory SQLite database
const { Database } = sqlite3;
const db = new Database(':memory:');

// Execute SQL statements
db.serialize(() => {
  // Create the `users` table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating user table:', err.message);
    } else {
      console.log('User table created successfully.');
    }
  });

  // Create the `todos` table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating todos table:', err.message);
    } else {
      console.log('Todos table created successfully.');
    }
  });
});

// Export the database instance
export default db;
