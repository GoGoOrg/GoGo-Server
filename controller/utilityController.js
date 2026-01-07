const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM utility ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { utilities: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM utility WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { utility: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { name, description, imageUrl } = req.body;
  if (!name || !description || !imageUrl) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO utility (name, description, imageUrl) VALUES ($1, $2, $3) RETURNING id",
      [name, description, imageUrl]
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
  const { name, description, imageUrl } = req.body;
  const { id } = req.params;

  if (!name || !description || !imageUrl) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query(
      "UPDATE utility SET name = $1, description = $2, imageUrl = $3 WHERE id = $4",
      [name, description, imageUrl]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM utility WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
