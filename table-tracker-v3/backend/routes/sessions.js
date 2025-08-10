const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Start session
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { table_id } = req.body;
    
    // Check if table is available
    const table = await pool.query('SELECT * FROM tables_config WHERE id = $1', [table_id]);
    if (table.rows[0].status !== 'available') {
      return res.status(400).json({ message: 'Table is not available' });
    }
    
    // Create new session
    const session = await pool.query(
      'INSERT INTO sessions (table_id, start_time) VALUES ($1, NOW()) RETURNING *',
      [table_id]
    );
    
    // Update table status
    await pool.query('UPDATE tables_config SET status = $1 WHERE id = $2', ['occupied', table_id]);
    
    res.json(session.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End session
router.patch('/:id/end', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { split_players = 1 } = req.body;
    
    // Get session and table info
    const sessionResult = await pool.query(
      `SELECT s.*, t.price_per_minute 
       FROM sessions s 
       JOIN tables_config t ON s.table_id = t.id 
       WHERE s.id = $1`,
      [id]
    );
    
    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const session = sessionResult.rows[0];
    const endTime = new Date();
    const startTime = new Date(session.start_time);
    const totalMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
    const totalAmount = Math.ceil(totalMinutes * session.price_per_minute);
    const amountPerPlayer = Math.ceil(totalAmount / split_players);
    
    // Update session
    const updatedSession = await pool.query(
      `UPDATE sessions 
       SET end_time = $1, total_minutes = $2, total_amount = $3, 
           split_players = $4, amount_per_player = $5 
       WHERE id = $6 RETURNING *`,
      [endTime, totalMinutes, totalAmount, split_players, amountPerPlayer, id]
    );
    
    // Update table status
    await pool.query('UPDATE tables_config SET status = $1 WHERE id = $2', ['available', session.table_id]);
    
    res.json(updatedSession.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get table sessions history
router.get('/table/:tableId', authMiddleware, async (req, res) => {
  try {
    const { tableId } = req.params;
    const sessions = await pool.query(
      `SELECT * FROM sessions 
       WHERE table_id = $1 AND end_time IS NOT NULL 
       ORDER BY created_at DESC LIMIT 50`,
      [tableId]
    );
    res.json(sessions.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active session for table
router.get('/active/:tableId', authMiddleware, async (req, res) => {
  try {
    const { tableId } = req.params;
    const session = await pool.query(
      'SELECT * FROM sessions WHERE table_id = $1 AND end_time IS NULL',
      [tableId]
    );
    res.json(session.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
