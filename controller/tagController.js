const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.getAll = async (req, res) => {
    try {
        connection.query('SELECT * FROM tag  ORDER BY created_at DESC', (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    tag: rows,
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

exports.getTop = async (req, res) => {
    try {
        connection.query(`SELECT t.tagId, t.name, COUNT(pt.productTagId) AS productCount
                        FROM tag t
                        JOIN product_tag pt ON t.tagId = pt.tagId
                        JOIN product p ON pt.productId = p.proId
                        GROUP BY t.tagId, t.name
                        ORDER BY productCount DESC
                        LIMIT 25;`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    tag: rows,
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
        connection.query('SELECT * FROM tag WHERE tagId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    tag: row,
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

            const newTag = {
                'name': req.body.name
            }

            connection.query('SELECT * FROM tag WHERE name = ?', newTag.name, async (err, row) => {
                if (err) {
                    res.status(500).json({
                        status: 'fail',
                        message: err,
                    });
                };
    
                console.log('Data received from Db');

                if (row == undefined || row.length == 0) {

                    connection.query('INSERT INTO tag SET ?', newTag, (err, row) => {
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
        connection.query("DELETE FROM tag WHERE tagId = ?", req.params.id, (err, row) => {
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
        if (req.body && req.body.name) {

            const newTag = {
                'tagId': req.params.id,
                'name': req.body.name
            }

            let sql = `UPDATE tag SET 
                name = '${newTag.name}'
            WHERE tagId = ${newTag.tagId}`

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
