const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category ORDER BY created_at DESC');
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { category: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM category WHERE "catId" = $1', [id]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { category: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ status: false, errorMessage: 'Missing name or description.' });
  }

  try {
    const exists = await pool.query('SELECT 1 FROM category WHERE name = $1', [name]);
    if (exists.rowCount > 0) {
      return res.status(400).json({
        status: false,
        errorMessage: `Category name "${name}" already exists.`,
      });
    }

    const result = await pool.query(
      'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING "catId"',
      [name, description]
    );

    res.status(201).json({
      status: true,
      title: 'Created successfully.',
      id: result.rows[0].catId,
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.update = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name || !description) {
    return res.status(400).json({ status: false, errorMessage: 'Missing name or description.' });
  }

  try {
    await pool.query(
      'UPDATE category SET name = $1, description = $2 WHERE "catId" = $3',
      [name, description, id]
    );

    res.status(200).json({ status: true, title: 'Updated successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM category WHERE "catId" = $1', [id]);
    res.status(200).json({ status: true, title: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
