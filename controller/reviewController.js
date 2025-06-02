const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM review ORDER BY createdat DESC');
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { reviews: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM review WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { review: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.create = async (req, res) => {
  const { content, userId, carId, star } = req.body;
  if (!content || !userId || !carId || !star) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO review (content, userId, carId, star) VALUES ($1, $2, $3, $4) RETURNING id',
      [content, userId, carId, star]
    );

    res.status(201).json({
      status: true,
      title: 'Created successfully.',
      id: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.update = async (req, res) => {
  const { content, userId, carId, star } = req.body;
  const { id } = req.params;

  if (!content || !userId || !carId || !star) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    await pool.query(
      'UPDATE review SET content = $1, userid = $2, carid = $3, star = $4  WHERE id = $5',
      [content, userId, carId, star, id]
    );

    res.status(200).json({ status: true, name: 'Updated successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM review WHERE id = $1', [id]);
    res.status(200).json({ status: true, name: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
