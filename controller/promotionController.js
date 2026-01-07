const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM promotion ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { promotions: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM promotion WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { promotion: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const {
    name,
    description,
    discountAmount,
    discountPercent,
    startDate,
    endDate,
    isActive,
  } = req.body;
  if (
    !name ||
    !description ||
    !discountAmount ||
    !discountPercent ||
    !startDate ||
    !endDate ||
    !isActive
  ) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO promotion (name, description, discountAmount, discountPercent, startDate, endDate, isActive) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [
        name,
        description,
        discountAmount,
        discountPercent,
        startDate,
        endDate,
        isActive,
      ]
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
  const {
    name,
    description,
    discountAmount,
    discountPercent,
    startDate,
    endDate,
    isActive,
  } = req.body;
  const { id } = req.params;

  if (
    !name ||
    !description ||
    !discountAmount ||
    !discountPercent ||
    !startDate ||
    !endDate ||
    !isActive
  ) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query(
      "UPDATE promotion SET name = $1, description = $2, discountAmount = $3, discountPercent = $4, startDate = $5, endDate = $6, isActive = $7 WHERE id = $8",
      [
        name,
        description,
        discountAmount,
        discountPercent,
        startDate,
        endDate,
        isActive,
        id,
      ]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM promotion WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
