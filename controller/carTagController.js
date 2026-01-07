const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM car_tag ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cartags: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM car_tag WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cartag: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { carid, tagid } = req.body;
  if (!carid || !tagid) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO cartag (carid, tagid) VALUES ($1, $2) RETURNING id",
      [carid, tagid]
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
  const { carid, tagid } = req.body;
  const { id } = req.params;

  if (!carid || !tagid) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query("UPDATE cartag SET carid = $1, tagid = $2 WHERE id = $3", [
      carid,
      tagid,
      id,
    ]);

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM car_tag WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
