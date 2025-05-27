exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM Orders', (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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

exports.getAllConfirmedOrder = async (req, res) => {
    try {
        let sql = `SELECT 
        o.*, 
        a.name as accountName
    FROM orders o
    JOIN account a ON o.accountId = a.accountId
    WHERE confirm = 1
    ORDER BY o.orderId;`
        connection.query(sql, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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

exports.getAllUnConfirmedOrder = async (req, res) => {
    try {
        let sql = `SELECT 
        o.*, 
        a.name as accountName
    FROM orders o
    JOIN account a ON o.accountId = a.accountId
    WHERE confirm = 0
    ORDER BY o.orderId;`
        connection.query(sql, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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


exports.getAllDetailsByAccountId = async (req, res) => {
    try {
        let sql = `SELECT 
                    o.*, 
                    a.name as accountName
                FROM orders o
                JOIN account a ON o.accountId = a.accountId
                ORDER BY o.orderId;
`
        connection.query(sql, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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

exports.getDetailsByOrderId = async (req, res) => {
    try {
        let sql = ` 
                SELECT 
                    o.*,
                    GROUP_CONCAT(sp.selectedProductId) AS selectedProductIds, -- Concatenate selectedProductIds
                    GROUP_CONCAT(sp.typeId) AS typeIds, -- Optionally concatenate typeIds
                    GROUP_CONCAT(sp.quantitySelected) AS quantitiesSelected, -- Optionally concatenate quantitiesSelected
                    GROUP_CONCAT(sp.sellingPrice) AS sellingPrices, -- Optionally concatenate sellingPrices
                    GROUP_CONCAT(t.name) AS typeNames, -- Concatenate type names
                    GROUP_CONCAT(p.proId) AS productIds, -- Concatenate productIds
                    GROUP_CONCAT(p.name) AS productNames, -- Optionally concatenate product names
                    GROUP_CONCAT(i.base64 SEPARATOR '||') AS imageBase64 -- Concatenate base64 images
                FROM orders o
                JOIN selectedProduct sp ON o.orderId = sp.orderId
                JOIN type t ON sp.typeId = t.typeId
                JOIN product p ON t.productId = p.proId
                LEFT JOIN (
                    SELECT imageId, base64, belongId
                    FROM image
                    WHERE imageId IN (
                        SELECT MIN(imageId) 
                        FROM image
                        GROUP BY belongId
                    )
                ) i ON i.belongId = CONCAT('product', p.proId)
                WHERE o.orderId = ${req.params.id}
                GROUP BY o.orderId -- Group by orderId to consolidate results per order
                ORDER BY o.orderId;`
        connection.query(`SET SESSION group_concat_max_len = 100000000`, (err, rows) => {
            if (err) throw err;
        });


        connection.query(sql, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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
exports.getDetailsByAccountId = async (req, res) => {
    try {
        let sql = ` 
                SELECT 
                    o.*,
                    GROUP_CONCAT( sp.selectedProductId ORDER BY sp.selectedProductId ASC) AS selectedProductIds, -- Đồng bộ thứ tự
                    GROUP_CONCAT( sp.typeId ORDER BY sp.typeId ASC) AS typeIds, -- Đồng bộ với selectedProductIds
                    GROUP_CONCAT( sp.quantitySelected ORDER BY sp.typeId ASC) AS quantitiesSelected, -- Đồng bộ theo typeIds
                    GROUP_CONCAT( sp.sellingPrice ORDER BY sp.typeId ASC) AS sellingPrices, -- Đồng bộ theo typeIds
                    GROUP_CONCAT( t.name ORDER BY sp.typeId ASC) AS typeNames, -- Đồng bộ với typeIds
                    GROUP_CONCAT( p.proId ORDER BY p.proId ASC) AS productIds, -- Đồng bộ với imageBase64
                    GROUP_CONCAT( p.name ORDER BY p.proId ASC) AS productNames, -- Đồng bộ với productIds
                    GROUP_CONCAT( i.base64 ORDER BY p.proId ASC SEPARATOR '||') AS imageBase64 -- Đồng bộ với productIds
                FROM orders o
                JOIN selectedProduct sp ON o.orderId = sp.orderId
                JOIN type t ON sp.typeId = t.typeId
                JOIN product p ON t.productId = p.proId
                LEFT JOIN (
                    SELECT imageId, base64, belongId
                    FROM image
                    WHERE imageId IN (
                        SELECT MIN(imageId) 
                        FROM image
                        GROUP BY belongId
                    )
                ) i ON i.belongId = CONCAT('product', p.proId)
                WHERE o.accountId = ${req.params.id}
                GROUP BY o.orderId -- Group by orderId để gộp kết quả theo đơn hàng
                ORDER BY o.orderId DESC;`
        connection.query(`SET SESSION group_concat_max_len = 100000000`, (err, rows) => {
            if (err) throw err;
        });


        connection.query(sql, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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
exports.getAllByAccountIdAndShipped = async (req, res) => {
    try {
        connection.query('SELECT * FROM Orders WHERE shipped = 1 AND accountId = ?', req.params.id, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    order: rows,
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
        connection.query('SELECT * FROM Orders WHERE orderId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    order: row,
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
        if (req.body && req.body.accountId && req.body.totalPrice && req.body.shippingPrice && req.body.shippingAddress) {

            const newOrder = {
                'accountId': req.body.accountId,
                'totalPrice': req.body.totalPrice,
                'shippingPrice': req.body.shippingPrice,
                'shippingAddress': req.body.shippingAddress,
                'shipped': req.body.shipped,
                'shippedDate': req.body.shippedDate,
                'shipmentTracking': req.body.shipmentTracking,
                'paid': req.body.paid,
                'confirm': req.body.confirm,
                'paymentType': req.body.paymentType,
                'note': req.body.note        
            }

            connection.query('INSERT INTO orders SET ?', newOrder, (err, row) => {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else
                
                    var sql = `UPDATE selectedproduct SET block = 1 , orderId = ${row.insertId} WHERE block = 0 AND accountId = ${req.body.accountId}`
                    connection.query(sql, (err, row) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        } 
                    })

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


exports.orderNow = async (req, res) => {
    try {
        if (req.body && req.body.accountId && req.body.totalPrice && req.body.shippingPrice && req.body.shippingAddress && req.body.sellingPrice && req.body.typeId && req.body.proId && req.body.quantitySelected && req.body.sellingPrice) {

            const newOrder = {
                'accountId': req.body.accountId,
                'totalPrice': req.body.totalPrice,
                'shippingPrice': req.body.shippingPrice,
                'shippingAddress': req.body.shippingAddress,
                'shipped': req.body.shipped,
                'shippedDate': req.body.shippedDate,
                'shipmentTracking': req.body.shipmentTracking,
                'paid': req.body.paid,
                'confirm': req.body.confirm            
            }

            connection.query('INSERT INTO orders SET ?', newOrder, (err, row) => {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else
                
                    var newSelectedProduct = {
                        'quantitySelected': req.body.quantitySelected,
                        'sellingPrice': req.body.sellingPrice,
                        'typeId': req.body.typeId,
                        'proId': req.body.proId,
                        'accountId': req.body.accountId,
                        'block': 1,
                        'orderId': row.insertId
                    }
                    
                    connection.query('INSERT INTO selectedproduct SET ?', newSelectedProduct, (err, row) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        } 
                    })

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
        connection.query("DELETE FROM orders WHERE orderId = ?", req.params.id, (err, row) => {
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


exports.checkReviewed = async (req, res) => {
    try {

        let sql = `
        SELECT 
            sp.selectedProductId,
            sp.proId,
            CASE 
                WHEN r.reviewId IS NOT NULL THEN 1
                ELSE 0
            END AS review_status
        FROM orders o
        JOIN selectedproduct sp ON o.orderId = sp.orderId
        LEFT JOIN review r ON sp.proId = r.productId AND sp.accountId = r.accountId
        WHERE o.orderId = ${req.params.id} AND o.accountId = ${req.body.accountId};`

        connection.query(sql, (err, row) => {
            if (err) {
                console.log(err)
                return;
            } else
                res.status(200).json({
                    status: true,
                    data: row
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


exports.updateShipmentTracking = async (req, res) => {
    try {

        let sql = `UPDATE orders SET
           shipmentTracking = '${req.body.shipmentTracking}'
        WHERE orderId = ${req.params.id}`

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

exports.updatePaid = async (req, res) => {
    try {

        let sql = `UPDATE orders SET
           paid = ${req.body.paid}
        WHERE orderId = ${req.params.id}`

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

exports.update = async (req, res) => {
    try {

        let sql = `UPDATE orders SET
           confirm = 1,
           shipmentTracking = 'Đang chờ giao hàng'
        WHERE orderId = ${req.params.id}`

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

exports.cancel = async (req, res) => {
    try {

        let sql = `UPDATE orders SET
           cancel = 1
        WHERE orderId = ${req.params.id}`

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