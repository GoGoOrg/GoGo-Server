const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM favorite ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { favorites: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM favorite WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { favorite: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  const { userid, carid } = req.body;
  if (!userid || !carid) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO favorite (userid, carid) VALUES ($1, $2) RETURNING id",
      [userid, carid]
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

exports.update = async (req, res) => {
  const { userid, carid } = req.body;
  const { id } = req.params;

  if (!userid || !carid) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query(
      "UPDATE favorite SET userid = $1, carid = $2 WHERE id = $3",
      [userid, carid, id]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM favorite WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
