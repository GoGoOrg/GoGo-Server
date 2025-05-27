const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name, u.email, u.avatar, c.name AS "carName"
      FROM review r
      JOIN user u ON r."userId" = u.id
      JOIN car c ON r."carId" = c.id
    `);

    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: {
        review: result.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getAllByCarId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.name, u.email, u.avatar
      FROM review r
      JOIN user u ON r."userId" = u.id
      WHERE r."carId" = $1
    `, [id]);

    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: {
        review: result.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getAllByCarIdAndUserId = async (req, res) => {
  try {
    const { carId, userId } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.name, u.email, u.avatar
      FROM review r
      JOIN user u ON r."userId" = u.id
      WHERE r."carId" = $1 AND u.id = $2
    `, [carId, userId]);

    res.status(200).json({
      status: 'success',
      total: result.rowCount,
      data: {
        review: result.rows,
      },
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
      data: {
        review: result.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { carId, userId, content, star } = req.body;

    if (!carId || !userId || !content || !star) {
      return res.status(400).json({ status: false, errorMessage: 'Missing required fields' });
    }

    await pool.query(`
      INSERT INTO review ("carId", "userId", content, star)
      VALUES ($1, $2, $3, $4)
    `, [carId, userId, content, star]);

    res.status(201).json({ status: true, title: 'Created successfully' });
  } catch (err) {
    res.status(500).json({ status: false, errorMessage: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, star } = req.body;

    if (!content || !star) {
      return res.status(400).json({ status: false, errorMessage: 'Missing required fields' });
    }

    await pool.query(`
      UPDATE review SET content = $1, star = $2, updated_at = NOW()
      WHERE "reviewId" = $3
    `, [content, star, id]);

    res.status(200).json({ status: true, title: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM review WHERE id = $1', [id]);

    res.status(200).json({ status: true, title: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
