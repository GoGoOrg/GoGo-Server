const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM car_promotion ORDER BY createdat DESC');
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { carpromotions: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM car_promotion WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { carpromotion: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.create = async (req, res) => {
  const {carId, promotionId} = req.body;
  if (!carId || !promotionId) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO carpromotion (carId, promotionId) VALUES ($1, $2) RETURNING id',
      [carId, promotionId]
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
  const { carId, promotionId } = req.body;
  const { id } = req.params;

  if (!carId || !promotionId) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    await pool.query(
      'UPDATE carpromotion SET carid = $1, promotionId = $2 WHERE id = $3',
      [ carId, promotionId, id]
    );

    res.status(200).json({ status: true, name: 'Updated successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM car_promotion WHERE id = $1', [id]);
    res.status(200).json({ status: true, name: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
