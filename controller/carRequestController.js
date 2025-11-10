const pool = require("../db");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT cr.*, c.name as carname, u.fullname FROM carrequest cr
      LEFT JOIN car c ON cr.carid = c.id
      LEFT JOIN users u ON cr.userid = u.id
      ORDER BY createdat DESC`
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByCaridAndUserid = async (req, res, next) => {
  try {
    const { carid, userid } = req.params;
    const result = await pool.query(
      "SELECT * FROM carrequest WHERE carid=$1 AND userid = $2 ORDER BY createdat DESC",
      [carid, userid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByCarid = async (req, res, next) => {
  try {
    const { carid } = req.params;
    const result = await pool.query(
      "SELECT * FROM carrequest WHERE carid=$1 ORDER BY createdat DESC",
      [carid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllByUserid = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const result = await pool.query(
      "SELECT * FROM carrequest WHERE userid=$1 ORDER BY createdat DESC",
      [userid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM carrequest WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOneByCaridAndUserid = async (req, res, next) => {
  try {
    const { carid, userid } = req.params;
    const result = await pool.query(
      "SELECT * FROM carrequest WHERE carid = $1 AND userid = $2",
      [carid, userid]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { carrequests: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const { carid, userid, starttime, endtime, price, totalprice } = req.body;
  if (!carid || !userid || !starttime || !endtime || !price || !totalprice) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the fields required.",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO carrequest (carid, userid, starttime, endtime, price, totalprice) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [carid, userid, starttime, endtime]
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
  const { accept, deny } = req.body;
  const { id } = req.params;

  if (id === undefined || accept === undefined || deny === undefined) {
    return res.status(400).json({
      status: false,
      errorMessage: "Missing one of the required fields.",
    });
  }

  try {
    await pool.query(
      "UPDATE carrequest SET accept = $1, deny = $2 WHERE id = $3",
      [accept, deny, id]
    );

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM carrequest WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
