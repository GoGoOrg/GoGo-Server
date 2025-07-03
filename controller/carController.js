const pool = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM car ORDER BY createdat DESC"
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
      `SELECT * FROM car c LEFT JOIN carimage ci ON c.id = ci.carid AND ci.isprimary = true
      WHERE c.ownerid = $1 ORDER BY c.createdat DESC`,
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

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM car WHERE id = $1", [id]);
    res.status(200).json({
      status: "success",
      total: result.rowCount,
      data: { car: result.rows },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.create = async (req, res) => {
  const {
    name,
    licenseplate,
    description,
    color,
    seats,
    price,
    ownerid,
    brandid,
    cityid,
    transmissiontypeid,
    fueltypeid,
    insurance,
    images,
  } = req.body;
  if (
    !name ||
    !ownerid ||
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

  try {
    await pool.query("BEGIN");

    // Insert into car
    const insertCarResult = await pool.query(
      `
      INSERT INTO car (
        name, licenseplate, description, color,
        seats, price, ownerid, brandid, cityid,
        transmissiontypeid, fueltypeid, insurance
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12
      )
      RETURNING id
    `,
      [
        name,
        licenseplate,
        description,
        color,
        seats,
        price,
        ownerid,
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

    res.status(201).json({
      status: true,
      title: "Created successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "fail", message: err.message });
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
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM car WHERE id = $1", [id]);
    res.status(200).json({ status: true, name: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
