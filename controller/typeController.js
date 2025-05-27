exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM type', (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    type: rows,
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

exports.getAllByProductId = async (req, res) => {
    try {
        connection.query('SELECT * FROM type WHERE productId = ?', req.params.id, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    type: rows,
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
        connection.query('SELECT * FROM type WHERE typeId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    type: row,
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
        if (req.body && req.body.name && req.body.productId && req.body.unitPrice && req.body.quantityInStock) {

            const newType = {
                'name': req.body.name,
                'productId': req.body.productId,
                'unitPrice': req.body.unitPrice,
                'quantityInStock': req.body.quantityInStock
            }

            connection.query('SELECT * FROM type WHERE name = ?', newType.name, async (err, row) => {
                if (err) {
                    res.status(500).json({
                        status: 'fail',
                        message: err,
                    });
                };
    
                console.log('Data received from Db');

                if (row == undefined || row.length == 0) {

                    connection.query('INSERT INTO type SET ?', newType, (err, row) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        } else
                            res.status(200).json({
                                status: true,
                                title: 'Created Successfully.'
                            });
                    })
                    } else {
                        // console.log(`UserName ${req.body.username} Already Exist!`);
                        res.status(400).json({
                            errorMessage: `Type ${req.body.name} already exist!`,
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
        connection.query("DELETE FROM type WHERE typeId = ?", req.params.id, (err, row) => {
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
        if (req.body && req.body.name && req.body.unitPrice && req.body.quantityInStock) {

            const newType = {
                'typeId': req.params.id,
                'name': req.body.name,
                'unitPrice': req.body.unitPrice,
                'quantityInStock': req.body.quantityInStock

            }

            let sql = `UPDATE type SET 
                name = '${newType.name}',
                unitPrice = '${newType.unitPrice}',
                quantityInStock = '${newType.quantityInStock}'
            WHERE typeId = ${newType.typeId}`

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

// exports.update = async (req, res) => {
//     try {
//         if (req.body) {
//             let count = 0
//             let sql = ''
//             // if (req.body.maNhanVien != null && req.body.maNhanVien.length > 0) {
//             //     count++;
//             //     sql += `maNhanVien = '${req.body.maNhanVien}' `
//             // }
//             // if (req.body.hoTen != null && req.body.hoTen.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `hoTen = '${req.body.hoTen}' `
//             // }
//             // if (req.body.email != null && req.body.email.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `email = '${req.body.email}' `
//             // }
//             // if (req.body.sdt != null && req.body.sdt.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `sdt = '${req.body.sdt}' `
//             // }
//             // if (req.body.ngaySinh != null && req.body.ngaySinh.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `ngaySinh = '${req.body.ngaySinh}' `
//             // }
//             // if (req.body.avatar != null && req.body.avatar.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `avatar = '${req.body.avatar}' `
//             // }
//             // if (req.body.vaiTro != null && req.body.vaiTro.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `vaiTro = '${req.body.vaiTro}' `
//             // }
//             // if (req.body.idPhongBan != null && req.body.idPhongBan.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `idPhongBan = '${req.body.idPhongBan}' `
//             // }
//             // if (req.body.chucVu != null && req.body.chucVu.length > 0) {
//             //     if (count > 0) sql += ', '
//             //     count++;
//             //     sql += `chucVu = '${req.body.chucVu}' `
//             // }

//             sql = 'UPDATE nguoidung SET ' + sql + `WHERE id = ${req.body.id};`

//             connection.query(sql, (err, row) => {
//                 if (err) {
//                     res.status(500).json({
//                         status: 'fail',
//                         message: err,
//                     });
//                 };

//                 res.status(200).json({
//                     status: 'update success',
//                     data: {
//                         nd: row,
//                     },
//                 });
//             })
//         } else {
//             res.status(400).json({
//                 errorMessage: 'Add proper parameter first!',
//                 status: false
//             });
//         }
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err,
//         });
//     }
// };
