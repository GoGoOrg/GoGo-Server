const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM brand ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { brands: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM brand WHERE id = $1", [id]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { brand: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing name or description." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO brand (name, description) VALUES ($1, $2) RETURNING id",
      [name, description]
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
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name || !description) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing name or description." });
  }

  try {
    await pool.query(
      "UPDATE brand SET name = $1, description = $2 WHERE id = $3",
      [name, description, id]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM brand WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
