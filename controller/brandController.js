exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM brand ORDER BY created_at DESC', (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    brand: rows,
                },
            });
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.update = async (req, res) => {
    try {
        if (req.body && req.body.name) {

            const newBrand = {
                brandId: req.params.id,
                name: req.body.name,
            }

            let sql = `UPDATE brand SET
                name = '${newBrand.name}'
            WHERE brandId = ${newBrand.brandId}`

            connection.query(sql, (err, row) => {
                if (err) {
                    console.log(err)
                    return;
                } else
                    res.status(200).json({
                        status: true,
                        title: 'Update Successfully.'
                    });
            }
            )
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTop10 = async (req, res) => {
    try {
        connection.query(`SELECT b.brandId, b.name, COUNT(p.proId) AS productCount
                        FROM brand b
                        JOIN product p ON b.brandId = p.brandId
                        GROUP BY b.brandId, b.name
                        ORDER BY productCount DESC
                        LIMIT 10;`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    brand: rows,
                },
            });
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getOne = async (req, res) => {
    try {
        connection.query('SELECT * FROM brand WHERE brandId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    brand: row,
                },
            });
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.create = async (req, res) => {
    try {
        if (req.body && req.body.name) {

            const newBrand = {
                'name': req.body.name            
            }

            connection.query('SELECT * FROM brand WHERE name = ?', newBrand.name, async (err, row) => {
                if (err) {
                    res.status(500).json({
                        status: 'fail',
                        message: err,
                    });
                };
    
                console.log('Data received from Db');

                if (row == undefined || row.length == 0) {

                    connection.query('INSERT INTO brand SET ?', newBrand, (err, row) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        } else
                            res.status(200).json({
                                status: true,
                                title: 'Created Successfully.',
                                id: row.insertId
                            });
                    })
                    } else {
                        // console.log(`UserName ${req.body.username} Already Exist!`);
                        res.status(400).json({
                            errorMessage: `Brand name ${req.body.name} already exist!`,
                            status: false
                        });
                    }
            });
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }


    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.delete = async (req, res) => {
    try {
        connection.query("DELETE FROM brand WHERE brandId = ?", req.params.id, (err, row) => {
            if (err) {
                console.log(err)
                res.status(400).json({
                    errorMessage: err,
                    status: false
                });
            } else
                res.status(200).json({
                    status: true,
                    title: 'Delete Successfully.'
                });
        }
        )
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};