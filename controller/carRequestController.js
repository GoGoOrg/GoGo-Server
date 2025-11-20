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
      `
      SELECT cr.*, c.name as carname, u.fullname FROM carrequest cr
      LEFT JOIN car c ON cr.carid = c.id
      LEFT JOIN users u ON cr.userid = u.id
      WHERE cr.carid = $1 AND cr.userid = $2
      ORDER BY createdat DESC
      `,
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
      `SELECT cr.*, c.name as carname, u.fullname FROM carrequest cr
      LEFT JOIN car c ON cr.carid = c.id
      LEFT JOIN users u ON cr.userid = u.id
      WHERE cr.carid = $1
      ORDER BY createdat DESC`,
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
      `SELECT cr.*, c.name as carname, u.fullname, ci.imageurl as carimage FROM carrequest cr
      LEFT JOIN car c ON cr.carid = c.id
      LEFT JOIN users u ON cr.userid = u.id
      LEFT JOIN carimage ci 
        ON c.id = ci.carid AND ci.isprimary = TRUE
      WHERE cr.userid = $1
      ORDER BY createdat DESC
      `,
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
    // 1️⃣ Create the request
    const result = await pool.query(
      "INSERT INTO carrequest (carid, userid, starttime, endtime, price, totalprice) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [carid, userid, starttime, endtime, price, totalprice]
    );

    const requestId = result.rows[0].id;

    // 2️⃣ Get car name + owner id
    const carResult = await pool.query(
      "SELECT name, ownerid FROM car WHERE id = $1",
      [carid]
    );

    const car = carResult.rows[0];
    const ownerId = car?.ownerid;

    if (ownerId) {
      // 3️⃣ Get user's full name
      const userResult = await pool.query(
        "SELECT fullname FROM users WHERE id = $1",
        [userid]
      );
      const userFullName = userResult.rows[0]?.fullname || "Người dùng";

      // 4️⃣ Create notification for owner
      const message = `Bạn có một yêu cầu thuê xe ${car.name} từ ${userFullName}`;
      await pool.query(
        "INSERT INTO notification (carid, userid, message, isread) VALUES ($1, $2, $3, $4)",
        [carid, ownerId, message, false]
      );
    }

    res.status(201).json({
      status: true,
      title: "Created successfully.",
      id: requestId,
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
    // 1️⃣ Update the car request
    const requestResult = await pool.query(
      "UPDATE carrequest SET accept = $1, deny = $2 WHERE id = $3 RETURNING userid, carid",
      [accept, deny, id]
    );

    const request = requestResult.rows[0];
    if (!request) {
      return res
        .status(404)
        .json({ status: false, errorMessage: "Request not found." });
    }

    const userId = request.userid;
    const carId = request.carid;

    // 2️⃣ Get car name
    const carResult = await pool.query("SELECT name FROM car WHERE id = $1", [
      carId,
    ]);
    const carName = carResult.rows[0]?.name || "xe";

    // 3️⃣ Prepare notification message
    let message = "";
    if (accept) {
      message = `Yêu cầu thuê xe "${carName}" của bạn đã được chấp nhận.`;
    } else if (deny) {
      message = `Yêu cầu thuê xe "${carName}" của bạn đã bị từ chối.`;
    }

    // 4️⃣ Insert notification for the user
    await pool.query(
      "INSERT INTO notification (carid, userid, message, isread) VALUES ($1, $2, $3, $4)",
      [carId, userId, message, false]
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
