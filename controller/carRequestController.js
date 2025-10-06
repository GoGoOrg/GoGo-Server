const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM carrequest ORDER BY createdat DESC');
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByCarId = async (req, res) => {
  try {
    const { carid } = req.params;
    const result = await pool.query('SELECT * FROM carrequest WHERE carid=$1 ORDER BY createdat DESC', [carid]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const result = await pool.query('SELECT * FROM carrequest WHERE userid=$1 ORDER BY createdat DESC', [userid]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM carrequest WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { caravailabilities: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOneByCarIdAndUserId = async (req, res) => {
  try {
    const { carId, userid } = req.params;
    const result = await pool.query('SELECT * FROM carrequest WHERE carid = $1 AND userid = $2', [carId, userid]);
    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: { caravailabilities: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  const {carId, startTime, endTime} = req.body;
  if (!carId || !startTime || !endTime) {
    return res.status(400).json({ status: false, errorMessage: 'Missing one of the fields required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO carrequest (carId, startTime, endTime) VALUES ($1, $2, $3) RETURNING id',
      [carId, startTime, endTime]
    );

    res.status(201).json({
      status: true,
      title: 'Created successfully.',
      id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
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
      'UPDATE carrequest SET carId = $1, startTime = $2, endTime = $3 WHERE id = $4',
      [carId, startTime, endTime, id]
    );

    res.status(200).json({ status: true, name: 'Updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM carrequest WHERE id = $1', [id]);
    res.status(200).json({ status: true, name: 'Deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
