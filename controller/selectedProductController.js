exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM selectedproduct', (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    sProducts: rows,
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

exports.getAllByAccountIdInCart = async (req, res) => {
    try {
        let sql = `SELECT sp.*, p.name, ty.name as typeName
                    FROM selectedproduct sp
                    JOIN product p ON sp.proId = p.proId
                    JOIN type ty ON sp.typeId = ty.typeId
                    WHERE sp.accountId = ${req.params.id} AND block = 0`

        connection.query(sql, req.params.id, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    sProducts: rows,
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
        connection.query('SELECT * FROM selectedproduct WHERE selectedProductId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    sProducts: row,
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
        if (req.body && req.body.proId && req.body.typeId && req.body.quantitySelected && req.body.sellingPrice && req.body.accountId) {
            let sqlSearch = `SELECT * FROM selectedproduct 
            WHERE typeId = ${req.body.typeId} AND accountId = ${req.body.accountId} AND block = 0`;
            connection.query(sqlSearch, (err, row) => {
                if (err) throw err;
              

                if (row == undefined || row.length == 0) {
                    const newSelectedProduct = {
                        'quantitySelected': req.body.quantitySelected,
                        'sellingPrice': req.body.sellingPrice,
                        'typeId': req.body.typeId,
                        'proId': req.body.proId,
                        'accountId': req.body.accountId,
                        'block': 0
                    }

                    connection.query('INSERT INTO selectedproduct SET ?', newSelectedProduct, (err, row) => {
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
                            });
                    })

                } else {

                    let sqlUpdate = `UPDATE selectedproduct SET quantitySelected = ${row[0].quantitySelected + req.body.quantitySelected}
                    WHERE selectedProductId = ${row[0].selectedProductId}`

                    connection.query(sqlUpdate, (err, row) => {
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
                            });
                    })
                    
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
        connection.query("DELETE FROM selectedproduct WHERE selectedProductId = ? AND block = 0", req.params.id, (err, row) => {
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

exports.updateQuantity = async (req, res) => {
    try {

        let sql = `UPDATE selectedproduct SET
            quantitySelected = ${req.body.number}
        WHERE selectedProductId = ${req.params.id}`

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
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: err,
        });
    }
};