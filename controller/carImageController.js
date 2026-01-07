const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM carimage ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carimages: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM carimage WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carimage: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { carid, imageUrl, isPrimary } = req.body;
  if (!carid || !imageUrl || !isPrimary) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO carimage (carid, imageUrl, isPrimary) VALUES ($1, $2, $3) RETURNING id",
      [carid, imageUrl, isPrimary]
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
  const { carid, imageUrl, isPrimary } = req.body;
  const { id } = req.params;

  if (!carid || !imageUrl || !isPrimary) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query(
      "UPDATE carimage SET userid = $1, carid = $2, isprimary = $3 WHERE id = $4",
      [carid, imageUrl, isPrimary, id]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM carimage WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
