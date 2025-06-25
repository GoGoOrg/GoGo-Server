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
    !insurance
  ) {
    return res
      .status(400)
      .json({ status: false, errorMessage: "Missing required fields" });
  }

  try {
    const query = `
    INSERT INTO car (
      name, licenseplate, description, color,
      seats, price, ownerid, brandid, cityid,
      transmissiontypeid, fueltypeid, insurance
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12
    ) RETURNING id;
  `;

    const values = [
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
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      status: true,
      title: "Created successfully.",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.log(err)
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
