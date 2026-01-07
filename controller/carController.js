const pool = require("../db");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*, ci.imageurl, ft.name AS fueltype, tt.name as transmissiontype, b.name AS brand, u.fullname AS ownername, u.avatar AS owneravatar, ct.name AS city
      FROM car c 
      LEFT JOIN carimage ci 
      ON c.id = ci.carid AND ci.isprimary = true 
      LEFT JOIN fueltype ft
      ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
      ON c.transmissiontypeid = tt.id
      LEFT JOIN brand b
      ON c.brandid = b.id
      LEFT JOIN users u
      ON c.ownerid = u.id
      LEFT JOIN city ct
      ON c.cityid = ct.id
      ORDER BY c.createdat DESC`
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getMyCar = async (req, res, next) => {
  const token = req.cookies["Token"];

  if (!token)
    return res
      .status(400)
      .json({ status: false, errorMessage: "Token missing" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT c.*, ci.imageurl, ft.name AS fueltype, tt.name as transmissiontype, b.name AS brand, ct.name as city
      FROM car c 
      LEFT JOIN carimage ci 
      ON c.id = ci.carid AND ci.isprimary = true 
      LEFT JOIN fueltype ft
      ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
      ON c.transmissiontypeid = tt.id
      LEFT JOIN brand b
      ON c.brandid = b.id
      LEFT JOIN city ct
      ON c.cityid = ct.id
      WHERE c.ownerid = $1
      ORDER BY c.createdat DESC`,
      [decoded.id]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getTopCars = async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT 
          c.*,
          ci.imageurl,
          ft.name AS fueltype,
          tt.name AS transmissiontype,
          b.name AS brand,
          ct.name AS city,
          COALESCE(r.totalrequests, 0) AS totalrequests,
          COALESCE(r.totalincome, 0) AS totalincome,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id', cr.id,
                      'userid', cr.userid,
                      'fullname', u.fullname,
                      'username', u.username,
                      'email', u.email,
                      'phone', u.phone,
                      'starttime', cr.starttime,
                      'endtime', cr.endtime,
                      'accept', cr.accept,
                      'deny', cr.deny
                  )
              ) FILTER (WHERE cr.id IS NOT NULL),
              '[]'
          ) AS carrequests
      FROM car c
      LEFT JOIN carimage ci 
          ON c.id = ci.carid AND ci.isprimary = TRUE
      LEFT JOIN fueltype ft
          ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
          ON c.transmissiontypeid = tt.id
      LEFT JOIN brand b
          ON c.brandid = b.id
      LEFT JOIN city ct
          ON c.cityid = ct.id
      LEFT JOIN (
          SELECT 
              carid,
              COUNT(*) AS totalrequests,
              SUM(totalprice) AS totalincome
          FROM carrequest
          WHERE deletedat IS NULL AND accept = TRUE
          GROUP BY carid
      ) r ON r.carid = c.id
      LEFT JOIN carrequest cr 
          ON c.id = cr.carid
      LEFT JOIN users u
          ON cr.userid = u.id
      GROUP BY 
          c.id, ci.imageurl, ft.name, tt.name, b.name, ct.name, r.totalrequests, r.totalincome
      ORDER BY r.totalrequests ASC
      LIMIT 20;
      `
    );

    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getAllByOwnerid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
    c.*,
    ci.imageurl,
    ft.name AS fueltype,
    tt.name AS transmissiontype,
    b.name AS brand,
    ct.name AS city,
    COALESCE(
        json_agg(
            json_build_object(
                'id', cr.id,
                'userid', cr.userid,
                'fullname', u.fullname,
                'username', u.username,
                'email', u.email,
                'phone', u.phone,
                'about', u.about,
                'avatar', u.avatar,
                'starttime', cr.starttime,
                'endtime', cr.endtime,
                'accept', cr.accept,
                'deny', cr.deny
            )
        ) FILTER (WHERE cr.id IS NOT NULL),
        '[]'
    ) AS carrequests
    FROM car c
    LEFT JOIN carimage ci 
        ON c.id = ci.carid AND ci.isprimary = TRUE
    LEFT JOIN fueltype ft
        ON c.fueltypeid = ft.id
    LEFT JOIN transmissiontype tt
        ON c.transmissiontypeid = tt.id
    LEFT JOIN brand b
        ON c.brandid = b.id
    LEFT JOIN city ct
        ON c.cityid = ct.id
    LEFT JOIN carrequest cr
        ON c.id = cr.carid
    LEFT JOIN users u
        ON cr.userid = u.id
    WHERE c.ownerid = $1
    GROUP BY 
        c.id, ci.imageurl, ft.name, tt.name, b.name, ct.name
    ORDER BY c.createdat DESC;

`,
      [id]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getAllByBrandid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.*, ci.imageurl, ft.name AS fueltype, tt.name as transmissiontype, ct.name as city
      FROM car c 
      LEFT JOIN carimage ci 
      ON c.id = ci.carid AND ci.isprimary = true 
      LEFT JOIN fueltype ft
      ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
      ON c.transmissiontypeid = tt.id
      LEFT JOIN city ct
      ON c.cityid = ct.id
      WHERE c.brandid = $1
      ORDER BY c.createdat DESC`,
      [id]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      `SELECT c.*, ci.imageurl, ft.name AS fueltype, tt.name as transmissiontype, ct.name as city
      FROM car c 
      LEFT JOIN carimage ci 
      ON c.id = ci.carid AND ci.isprimary = true 
      LEFT JOIN fueltype ft
      ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
      ON c.transmissiontypeid = tt.id
      LEFT JOIN city ct
      ON c.cityid = ct.id
      WHERE c.name ILIKE $1
      ORDER BY c.createdat DESC`,
      [`%${name}%`]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchByCityName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      `SELECT c.*, ci.imageurl, ft.name AS fueltype, tt.name as transmissiontype, ct.name as city
      FROM car c 
      LEFT JOIN carimage ci 
      ON c.id = ci.carid AND ci.isprimary = true 
      LEFT JOIN fueltype ft
      ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
      ON c.transmissiontypeid = tt.id
      LEFT JOIN city ct
      ON c.cityid = ct.id
      WHERE ct.name ILIKE $1
      ORDER BY c.createdat DESC`,
      [`%${name}%`]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { cars: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        c.*, 
        COALESCE(ARRAY_AGG(DISTINCT ci.imageurl) FILTER (WHERE ci.imageurl IS NOT NULL), '{}') AS images,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', util.id,
            'name', util.name,
            'icon', util.icon
          )) FILTER (WHERE util.name IS NOT NULL),
          '[]'
        ) AS utilities,
        ft.name AS fueltype, 
        tt.name AS transmissiontype, 
        b.name AS brand, 
        u.fullname AS ownername, 
        u.avatar AS owneravatar,
        ct.name AS city
      FROM 
        car c 
      LEFT JOIN carimage ci 
        ON c.id = ci.carid
      LEFT JOIN fueltype ft
        ON c.fueltypeid = ft.id
      LEFT JOIN transmissiontype tt
        ON c.transmissiontypeid = tt.id
      LEFT JOIN brand b
        ON c.brandid = b.id
      LEFT JOIN users u
        ON c.ownerid = u.id
      LEFT JOIN city ct
        ON c.cityid = ct.id
      LEFT JOIN car_utility cutil
        ON c.id = cutil.carid
      LEFT JOIN utility util
        ON cutil.utilityid = util.id
      WHERE 
        c.id = $1
      GROUP BY 
        c.id, ft.name, tt.name, b.name, u.fullname, ct.name, u.avatar
      ORDER BY 
        c.createdat DESC;
      `,
      [id]
    );
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { car: result.rows },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const {
    name,
    licenseplate,
    description,
    regulation,
    color,
    seats,
    price,
    brandid,
    cityid,
    transmissiontypeid,
    fueltypeid,
    insurance,
    images,
  } = req.body;
  if (
    !name ||
    !licenseplate ||
    !description ||
    !color ||
    !seats ||
    !price ||
    !brandid ||
    !cityid ||
    !transmissiontypeid ||
    !fueltypeid ||
    !insurance ||
    !images
  ) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing required fields" });
  }
  const token = req.cookies["Token"];

  if (!token)
    return res
      .status(400)
      .json({ status: false, errorMessage: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query("BEGIN");

    // Insert into car
    const insertCarResult = await pool.query(
      `
      INSERT INTO car (
        name, licenseplate, description, regulation, color,
        seats, price, ownerid, brandid, cityid,
        transmissiontypeid, fueltypeid, insurance
      ) VALUES (
        $1, $2, $3, $4, $5, 
        $6, $7, $8, $9, $10,
        $11, $12, $13
      )
      RETURNING id
    `,
      [
        name,
        licenseplate,
        description,
        regulation,
        color,
        seats,
        price,
        decoded.id,
        brandid,
        cityid,
        transmissiontypeid,
        fueltypeid,
        insurance,
      ]
    );

    const carid = insertCarResult.rows[0].id;

    // Insert multiple car images
    const imageInsertQuery = `
      INSERT INTO carimage (carid, imageurl, isprimary)
      VALUES ${images
        .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
        .join(",\n")}
    `;

    const imageValues = images.flatMap((img, i) => [img, i === 0]); // first image is primary
    await pool.query(imageInsertQuery, [carid, ...imageValues]);
    await pool.query("COMMIT");

    logger.info("Car created", { carid, userid: decoded.id });

    res.status(201).json({
      status: true,
      title: "Created successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing name." });
  }

  try {
    await pool.query("UPDATE car SET name = $1 WHERE id = $2", [name, id]);

    res.status(200).json({ status: true, message: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM car WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
