const express = require('express');
const pool = require('../config/database');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get all tables
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tables = await pool.query('SELECT * FROM tables_config ORDER BY id');
    res.json(tables.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update table price (admin or staff)
router.patch('/:id/price', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_minute } = req.body;
    
    const updatedTable = await pool.query(
      'UPDATE tables_config SET price_per_minute = $1 WHERE id = $2 RETURNING *',
      [price_per_minute, id]
    );
    
    res.json(updatedTable.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update table status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedTable = await pool.query(
      'UPDATE tables_config SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    res.json(updatedTable.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear table data (admin only)
router.delete('/:id/sessions', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sessions WHERE table_id = $1', [id]);
    res.json({ message: 'Table sessions cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
