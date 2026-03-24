const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nombre, email, telefono, fecha_nacimiento, edad } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, telefono, fecha_nacimiento, edad)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, email, telefono, fecha_nacimiento, edad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { nombre, email, telefono, fecha_nacimiento, edad } = req.body;
  try {
    const result = await pool.query(
      `UPDATE usuarios SET nombre=$1, email=$2, telefono=$3, fecha_nacimiento=$4, edad=$5
       WHERE id=$6 RETURNING *`,
      [nombre, email, telefono, fecha_nacimiento, edad, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;