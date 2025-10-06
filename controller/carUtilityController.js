const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM car_utility ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carutilities: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM car_utility WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carutility: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  const { carId, utilityId } = req.body;
  if (!carId || !utilityId) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO carutility (carId, utilityId) VALUES ($1, $2) RETURNING id",
      [carId, utilityId]
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

// PATCH /api/car-utility/:carId
exports.update = async (req, res, next) => {
  const { id } = req.params; // ✅ match your route
  const utilityIds = req.body;

  if (!Array.isArray(utilityIds)) {
    return res.status(400).json({ status: false, errorMessage: "Expected array of utilityIds." });
  }

  try {
    await pool.query("DELETE FROM car_utility WHERE carid = $1", [id]);

    if (utilityIds.length > 0) {
      const values = utilityIds.map((_, i) => `($1, $${i + 2})`).join(", ");
      const query = `INSERT INTO car_utility (carid, utilityid) VALUES ${values}`;
      await pool.query(query, [id, ...utilityIds]);
    }

    res.status(200).json({ status: true, message: "Utilities updated successfully." });
  } catch (err) {
    next(err);
  }
};



exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM car_utility WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
