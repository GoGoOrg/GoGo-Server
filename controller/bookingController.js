const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM booking ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { bookings: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM booking WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { booking: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { userid, carid, status, startDateTime, endDateTime } = req.body;
  if (!userid || !carid || !status || !startDateTime || !endDateTime) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO booking (userid, carid, status, startdatetime, enddatetime) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [userid, carid, status, startDateTime, endDateTime]
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
  const { userid, carid, status, startDateTime, endDateTime } = req.body;
  const { id } = req.params;

  if (!userid || !carid || !status || !startDateTime || !endDateTime) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    await pool.query(
      "UPDATE booking SET userid = $1, carid = $2, status = $3, startDateTime = $4, endDateTime = $5,  WHERE id = $6",
      [userid, carid, status, startDateTime, endDateTime, id]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM booking WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
