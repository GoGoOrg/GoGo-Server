const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM favorite ORDER BY createdat DESC');
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { favorites: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM favorite WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { favorite: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.create = async (req, res) => {
  const {userId, carId} = req.body;
  if (!userId || !carId) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO favorite (userId, carId) VALUES ($1, $2) RETURNING id',
      [userId, carId]
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
  const { userId, carId } = req.body;
  const { id } = req.params;

  if (!userId || !carId) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    await pool.query(
      'UPDATE favorite SET userid = $1, carid = $2 WHERE id = $3',
      [ userId, carId, id]
    );

    res.status(200).json({ status: true, name: 'Updated successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM favorite WHERE id = $1', [id]);
    res.status(200).json({ status: true, name: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
