const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM feedback ORDER BY createdat DESC"
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { feedbacks: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM feedback WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { feedback: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing title or description." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO feedback (title, description) VALUES ($1, $2) RETURNING id",
      [title, description]
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
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing title or description." });
  }

  try {
    await pool.query(
      "UPDATE feedback SET title = $1, description = $2 WHERE id = $3",
      [title, description, id]
    );

    res.status(200).json({ status: true, title: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM feedback WHERE id = $1", [id]);
    res.status(200).json({ status: true, title: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
