const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM review ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { reviews: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByCarid = async (req, res, next) => {
  try {
    const { carid } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.fullname, u.avatar FROM review r
      LEFT JOIN users u
      ON r.userid = u.id
      WHERE r.carid = $1
      ORDER BY createdat DESC`,
      [carid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { reviews: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByCaridAndUserid = async (req, res, next) => {
  try {
    const { carid, userid } = req.params;

    const result = await pool.query(
      `SELECT * FROM review 
      WHERE carid = $1 AND userid = $2
      ORDER BY createdat DESC`,
      [carid, userid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { reviews: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM review WHERE id = $1", [id]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { review: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { content, userid, carid, star } = req.body;
  if (!content || !userid || !carid || !star) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO review (content, userid, carid, star) VALUES ($1, $2, $3, $4) RETURNING id",
      [content, userid, carid, star]
    );

    res.status(201).json({
      status: true,
      title: "Created successfully.",
      id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const { content, star } = req.body;
  const { id } = req.params;

  if (!content || !star) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query(
      "UPDATE review SET content = $1, star = $2  WHERE id = $3",
      [content, star, id]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM review WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
