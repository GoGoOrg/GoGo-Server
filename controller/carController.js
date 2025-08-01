const pool = require("../db");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, ci.imageurl, ft.name AS fueltype, tt.name as transmissiontype, b.name AS brand, u.fullname AS ownername, ct.name AS city
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

exports.getMyCar = async (req, res) => {
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

exports.getAllByOwnerId = async (req, res) => {
  try {
    const { id } = req.params;

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

exports.getAllByBrandId = async (req, res) => {
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

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        c.*, 
        ARRAY_AGG(ci.imageurl) AS images, 
        ft.name AS fueltype, 
        tt.name AS transmissiontype, 
        b.name AS brand, 
        u.fullname AS ownername, 
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
      WHERE 
        c.id = $1
      GROUP BY 
        c.id, ft.name, tt.name, b.name, u.fullname, ct.name
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
    next(err);
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

    const carId = insertCarResult.rows[0].id;

    // Insert multiple car images
    const imageInsertQuery = `
      INSERT INTO carimage (carid, imageurl, isprimary)
      VALUES ${images
        .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
        .join(",\n")}
    `;

    const imageValues = images.flatMap((img, i) => [img, i === 0]); // first image is primary
    await pool.query(imageInsertQuery, [carId, ...imageValues]);
    await pool.query("COMMIT");

    logger.info("Car created", { carId: result.id, userId: req.user.id });

    res.status(201).json({
      status: true,
      title: "Created successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing name." });
  }

  try {
    await pool.query("UPDATE car SET name = $1 WHERE id = $2", [
      name,
      description,
      id,
    ]);

    res.status(200).json({ status: true, name: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM car WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    next(err);
  }
};
