exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM component  ORDER BY created_at DESC', (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    component: rows,
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
        connection.query('SELECT * FROM component WHERE componentId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    component: row,
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
        if (req.body && req.body.name && req.body.description) {

            const newComp = {
                'name': req.body.name,
                'description': req.body.description
            }

            connection.query('SELECT * FROM component WHERE name = ?', newComp.name, async (err, row) => {
                if (err) {
                    res.status(500).json({
                        status: 'fail',
                        message: err,
                    });
                };
    
                console.log('Data received from Db');

                if (row == undefined || row.length == 0) {

                    connection.query('INSERT INTO component SET ?', newComp, (err, row) => {
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
                            errorMessage: `Tag name ${req.body.name} already exist!`,
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
        connection.query("DELETE FROM component WHERE componentId = ?", req.params.id, (err, row) => {
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


exports.update = async (req, res) => {
    try {
        if (req.body  && req.body.name && req.body.description) {

            const newComp = {
                componentId: req.params.id,
                name: req.body.name,
                description: req.body.description,
            }

            let sql = `UPDATE component SET
                name = '${newComp.name}',
                description = '${newComp.description}'
            WHERE componentId = ${newComp.componentId}`

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