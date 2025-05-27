exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM product_tag', (err,rows) => {
            if(err) throw err;
            
            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    product_tag: rows,
                },
            });
        });
    }  catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err,
    });
    }
};

exports.getAllByProductId = async (req, res) => {
    try {
        connection.query('SELECT * FROM product_tag WHERE productId = ?', req.params.id , (err,rows) => {
            if(err) throw err;
            
            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    product_tag: rows,
                },
            });
        });
    }  catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err,
    });
    }
};

exports.getAllByTagId = async (req, res) => {
    try {
        connection.query('SELECT * FROM product_tag WHERE tagId = ?', req.params.id , (err,rows) => {
            if(err) throw err;
            
            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    product_tag: rows,
                },
            });
        });
    }  catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err,
    });
    }
};

exports.getOne = async (req, res) => {
    try {
        connection.query('SELECT * FROM product_tag WHERE productTagId = ?', req.params.id, (err,row) => {
            if(err) throw err;
            
            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    product_tag: row,
                },
            });
        });
    }  catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err,
    });
    }
};

exports.create = async (req, res) => {
    try {
        if (req.body && req.body.name && req.body.tagId && req.body.productId) {

            const newPTag = {
                'name': req.body.name,
                'tagId': req.body.tagId,
                'productId': req.body.productId
            }

            connection.query('INSERT INTO product_tag SET ?', newPTag, (err, row) => {
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
            }
            )
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
        connection.query("DELETE FROM product_tag WHERE productTagId = ?", req.params.id, (err, row) => {
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