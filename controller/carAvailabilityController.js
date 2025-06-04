const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM caravailability ORDER BY createdat DESC');
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { caravailabilitys: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM caravailability WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { caravailabilities: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.create = async (req, res) => {
  const {carId, startTime, endTime} = req.body;
  if (!carId || !startTime || !endTime) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO caravailability (carId, startTime, endTime) VALUES ($1, $2, $3) RETURNING id',
      [carId, startTime, endTime]
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
  const {carId, startTime, endTime} = req.body;
  const { id } = req.params;

  if (!carId || !startTime || !endTime) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    await pool.query(
      'UPDATE caravailability SET carId = $1, startTime = $2, endTime = $3 WHERE id = $4',
      [carId, startTime, endTime, id]
    );

    res.status(200).json({ status: true, name: 'Updated successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM caravailability WHERE id = $1', [id]);
    res.status(200).json({ status: true, name: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
