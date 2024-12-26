import express from 'express';
import db from '../db.js';
import authenticateToken from '../middleware/authMiddleware.js'; // Assuming you have an auth middleware

const router = express.Router();

// Get all todos for logged in user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id; // The userId is set by the authenticateToken middleware
  db.all('SELECT * FROM todos WHERE user_id = ?', [userId], (err, todos) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching todos', error: err.message });
    }
    res.json(todos);
  });
});

// Create a new todo
router.post('/', authenticateToken, (req, res) => {
  const { task, completed = false } = req.body; // Default to 'false' if completed isn't provided
  const userId = req.user.id; // The userId is set by the authenticateToken middleware

  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }

  const stmt = db.prepare('INSERT INTO todos (task, completed, user_id) VALUES (?, ?, ?)');
  stmt.run(task, completed, userId, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating todo', error: err.message });
    }
    res.status(201).json({
      message: 'Todo created successfully',
      todo: {
        id: this.lastID,
        task,
        completed,
        userId
      }
    });
  });
});

// Update a todo
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const userId = req.user.id; // The userId is set by the authenticateToken middleware

  if (!task && completed === undefined) {
    return res.status(400).json({ message: 'Task or completed status is required' });
  }

  const stmt = db.prepare('UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?');
  stmt.run(task, completed, id, userId, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating todo', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Todo not found or not owned by user' });
    }
    res.json({ message: 'Todo updated successfully' });
  });
});

// Delete a todo
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // The userId is set by the authenticateToken middleware

  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  stmt.run(id, userId, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting todo', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Todo not found or not owned by user' });
    }
    res.json({ message: 'Todo deleted successfully' });
  });
});

export default router;
