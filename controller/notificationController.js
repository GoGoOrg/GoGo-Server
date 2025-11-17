const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
      n.*,
      u.fullname as fullname,
      u.avatar as avatar,
      c.name AS carname,
      FROM notification n 
      LEFT JOIN users u ON n.userid = u.id
      LEFT JOIN car c ON n.carid = c.id 
      ORDER BY n.createdat DESC`
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { notifications: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByUserId = async (req, res) => {
  const { userid } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
      n.*,
      u.fullname as fullname,
      u.avatar as avatar,
      c.name AS carname,
      FROM notification n 
      LEFT JOIN users u ON n.userid = u.id
      LEFT JOIN car c ON n.carid = c.id 
      WHERE n.userid = $1
      ORDER BY n.createdat DESC`,
      [userid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { notifications: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM notification WHERE id = $1",
      [id]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { notification: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  const { userid, message, carid } = req.body;
  if (!userid || !message) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing userid or message." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notification (userid, message, carid) VALUES ($1, $2, $3) RETURNING id",
      [userid, message, carid]
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
  const { isread } = req.body;
  const { id } = req.params;

  if (isread === undefined) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing isread." });
  }

  try {
    await pool.query("UPDATE notification SET isread = $1 WHERE id = $2", [
      isread,
      id,
    ]);

    res
      .status(200)
      .json({ status: true, message: "Updated successfully.", isread });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notification WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
