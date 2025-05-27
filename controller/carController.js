exports.getAll = async (req, res) => {
    try {
        connection.query(`SELECT 
                p.*,
                t.unitPrice AS unitPrice
            FROM 
                Product p
            LEFT JOIN 
                Type t ON p.proId = t.productId
            INNER JOIN (
                SELECT 
                    productId,
                    MIN(typeId) AS first_typeId
                FROM 
                    Type
                GROUP BY 
                    productId
            ) ft ON t.typeId = ft.first_typeId;`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    products: rows,
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

exports.getAllByBrandId = async (req, res) => {
    try {
        connection.query(`SELECT 
    p.*, 
    i.base64 AS image
    FROM product p
    LEFT JOIN (
        SELECT imageId, base64, belongId
        FROM image img
        WHERE img.imageId = (
            SELECT MIN(imageId) 
            FROM image 
            WHERE belongId = img.belongId
        )
    ) i ON i.belongId = CONCAT('product', p.proId)
    WHERE p.brandId = ?`, req.params.id, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    products: rows,
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


exports.getTopSales = async (req, res) => {
    try {
        connection.query(`SELECT 
    p.*, 
    i.base64 AS image,
    b.name AS brandName,
    b.brandId,
    t.typeId,
    t.unitPrice,
    COALESCE(s.totalSales, 0) AS totalSales
FROM product p
LEFT JOIN (
    SELECT img.imageId, img.base64, img.belongId
    FROM image img
    WHERE img.imageId = (
        SELECT MIN(imageId) 
        FROM image 
        WHERE belongId = img.belongId
    )
) i ON i.belongId = CONCAT('product', p.proId)
JOIN brand b ON p.brandId = b.brandId
LEFT JOIN (
    SELECT t1.typeId, t1.productId, t1.unitPrice
    FROM type t1
    WHERE t1.typeId = (
        SELECT MIN(typeId)
        FROM type 
        WHERE productId = t1.productId
    )
) t ON t.productId = p.proId
LEFT JOIN (
    SELECT sp.proId, SUM(sp.quantitySelected) AS totalSales
    FROM selectedproduct sp
    JOIN orders o ON sp.orderId = o.orderId
    WHERE sp.block = 1 AND o.cancel = 0
    GROUP BY sp.proId
) s ON s.proId = p.proId
ORDER BY s.totalSales DESC
LIMIT 20;
`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    products: rows,
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



exports.getAllByCategoryId = async (req, res) => {
    try {
        connection.query(`SELECT 
                p.*, 
                i.base64 AS image,
                b.name AS brandName,
                b.brandId,
                t.typeId,
                t.unitPrice
            FROM product p
            LEFT JOIN (
                SELECT imageId, base64, belongId
                FROM image img
                WHERE img.imageId = (
                    SELECT MIN(imageId) 
                    FROM image 
                    WHERE belongId = img.belongId
                )
            ) i ON i.belongId = CONCAT('product', p.proId)
            JOIN brand b ON p.brandId = b.brandId
            LEFT JOIN (
                SELECT typeId, productId, unitPrice
                FROM type t1
                WHERE t1.typeId = (
                    SELECT MIN(typeId)
                    FROM type 
                    WHERE productId = t1.productId
                )
            ) t ON t.productId = p.proId
            WHERE p.catId = ${req.params.id}
            LIMIT 10;`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    products: rows,
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


exports.getAllDetailByBrandId = async (req, res) => {
    try {
        connection.query(`SELECT 
                p.*, 
                i.base64 AS image,
                b.name AS brandName,
                b.brandId,
                t.typeId,
                t.unitPrice
            FROM product p
            LEFT JOIN (
                SELECT imageId, base64, belongId
                FROM image img
                WHERE img.imageId = (
                    SELECT MIN(imageId) 
                    FROM image 
                    WHERE belongId = img.belongId
                )
            ) i ON i.belongId = CONCAT('product', p.proId)
            JOIN brand b ON p.brandId = b.brandId
            LEFT JOIN (
                SELECT typeId, productId, unitPrice
                FROM type t1
                WHERE t1.typeId = (
                    SELECT MIN(typeId)
                    FROM type 
                    WHERE productId = t1.productId
                )
            ) t ON t.productId = p.proId
            WHERE p.brandId = ${req.params.id}
            LIMIT 20;`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    products: rows,
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


exports.getAllByCategoryIdNoLimit = async (req, res) => {
    try {
        connection.query(`SELECT 
                p.*, 
                i.base64 AS image,
                b.name AS brandName,
                b.brandId,
                t.typeId,
                t.unitPrice
            FROM product p
            LEFT JOIN (
                SELECT imageId, base64, belongId
                FROM image img
                WHERE img.imageId = (
                    SELECT MIN(imageId) 
                    FROM image 
                    WHERE belongId = img.belongId
                )
            ) i ON i.belongId = CONCAT('product', p.proId)
            JOIN brand b ON p.brandId = b.brandId
            LEFT JOIN (
                SELECT typeId, productId, unitPrice
                FROM type t1
                WHERE t1.typeId = (
                    SELECT MIN(typeId)
                    FROM type 
                    WHERE productId = t1.productId
                )
            ) t ON t.productId = p.proId
            WHERE p.catId = ${req.params.id};`, (err, rows) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: rows.length,
                data: {
                    products: rows,
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
        connection.query('SELECT * FROM product WHERE proId = ?', req.params.id, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    products: row,
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

exports.getOneDetails = async (req, res) => {
    try {
        let sql = `    
            SELECT 
                p.*, 
                typeData.typeNames,
                typeData.unitPrices,
                typeData.quantitiesInStock,
                typeData.typeIds,
                GROUP_CONCAT(DISTINCT t.tagId) AS tagIds,  -- You can keep DISTINCT here if you want unique tagIds
                GROUP_CONCAT(DISTINCT i.imageId) AS imageIds, -- Use DISTINCT if you want unique imageIds
                GROUP_CONCAT(DISTINCT i.base64 SEPARATOR '|') AS base64s, 
                GROUP_CONCAT(DISTINCT c.componentId) AS componentIds
            FROM product p
            -- Subquery to aggregate types
            LEFT JOIN (
                SELECT 
                    ty.productId,
                    GROUP_CONCAT(ty.name) AS typeNames,
                    GROUP_CONCAT(ty.unitPrice) AS unitPrices,
                    GROUP_CONCAT(ty.quantityInStock) AS quantitiesInStock,
                    GROUP_CONCAT(ty.typeId) AS typeIds
                FROM type ty
                GROUP BY ty.productId
            ) typeData ON p.proId = typeData.productId
            -- Join with product_tags and tags tables
            LEFT JOIN product_tag pt ON p.proId = pt.productId
            LEFT JOIN tag t ON pt.tagId = t.tagId
            -- Join with images table
            LEFT JOIN image i ON i.belongId = CONCAT('product', p.proId)
            LEFT JOIN product_component pc ON p.proId = pc.productId
            LEFT JOIN component c ON pc.componentId = c.componentId

            WHERE p.proId =  ${req.params.id}
            GROUP BY p.proId
        `

        connection.query(sql, (err, row) => {
            if (err) throw err;

            console.log('Data received from Db:');
            res.status(200).json({
                status: 'success',
                total: row.length,
                data: {
                    products: row,
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
        if (req.body && req.body.catId && req.body.brandId && req.body.name && req.body.description && req.body.unit && req.body.guide && req.body.maintain && req.body.note && req.body.types && req.body.tagIds && req.body.images && req.body.componentIds) {

            const newProduct = {
                proId: req.params.id,
                catId: req.body.catId,
                brandId: req.body.brandId,
                name: req.body.name,
                description: req.body.description,
                unit: req.body.unit,
                guide: req.body.guide,
                maintain: req.body.maintain,
                note: req.body.note
            }

            let sql = `UPDATE product SET 
                catId = '${newProduct.catId}',
                brandId = '${newProduct.brandId}',
                name = '${newProduct.name}',
                description = '${newProduct.description}',
                unit = '${newProduct.unit}',
                guide = '${newProduct.guide}',
                maintain = '${newProduct.maintain}',
                note = '${newProduct.note}'
            WHERE proId = ${newProduct.proId}`

            connection.query(sql, (err, row) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else {
                    // delete all image and product_tags and  productcomponent
                    connection.query('DELETE FROM product_tag WHERE productId = ?', req.params.id, (err, result) => { 
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        }
                    });
                    connection.query('DELETE FROM product_component WHERE productId = ?', req.params.id, (err, result) => { 
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        }
                    });
                    const queryDelete = `DELETE FROM image WHERE belongId = CONCAT("product", ${req.params.id})`;
                    connection.query(queryDelete, req.params.id, (err, result) => { 
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        }
                    });
        
                    // Loop through the images array
                    for (let i = 0; i < req.body.images.length; i++) {
                        let newImage = {
                            base64: req.body.images[i], 
                            belongId: "product" + req.params.id // Using row.insertId from product insert
                        };
            
                        // Insert each image into the image table
                        connection.query('INSERT INTO image SET ?', newImage, (err, result) => { // Use newImage instead of newProduct
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }


                    for (let i = 0; i < req.body.tagIds.length; i++) {
                        let newProductTag = {
                            productId: req.params.id, 
                            tagId: req.body.tagIds[i]
                        };
            
                        connection.query('INSERT INTO product_tag SET ?', newProductTag, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }

                    for (let i = 0; i < req.body.componentIds.length; i++) {
                        let newProductComp = {
                            productId: req.params.id, 
                            componentId: req.body.componentIds[i]
                        };
            
                        connection.query('INSERT INTO product_component SET ?', newProductComp, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }

                    // Send success response after inserting product
                    res.status(200).json({
                        message: "Product and images inserted successfully",
                        status: true
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

exports.create = async (req, res) => {
    try {
        if (req.body && req.body.catId && req.body.brandId && req.body.name && req.body.description && req.body.unit && req.body.guide && req.body.maintain && req.body.note && req.body.types && req.body.tagIds && req.body.images && req.body.componentIds) {

            const newProduct = {
                catId: req.body.catId,
                brandId: req.body.brandId,
                name: req.body.name,
                description: req.body.description,
                unit: req.body.unit,
                guide: req.body.guide,
                maintain: req.body.maintain,
                note: req.body.note
            }

            connection.query('INSERT INTO product SET ?', newProduct, (err, row) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else {
                    // Loop through the images array
                    for (let i = 0; i < req.body.images.length; i++) {
                        let newImage = {
                            base64: req.body.images[i], 
                            belongId: "product" + row.insertId // Using row.insertId from product insert
                        };
            
                        // Insert each image into the image table
                        connection.query('INSERT INTO image SET ?', newImage, (err, result) => { // Use newImage instead of newProduct
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }
            
                    for (let i = 0; i < req.body.types.length; i++) {
                        let newType = {
                            name: req.body.types[i].name, 
                            productId: row.insertId, 
                            unitPrice: req.body.types[i].unitPrice, // Using row.insertId from product insert
                            quantityInStock: req.body.types[i].quantityInStock
                        };
            
                        connection.query('INSERT INTO type SET ?', newType, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }

                    for (let i = 0; i < req.body.tagIds.length; i++) {
                        let newProductTag = {
                            productId: row.insertId, 
                            tagId: req.body.tagIds[i]
                        };
            
                        connection.query('INSERT INTO product_tag SET ?', newProductTag, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }

                    for (let i = 0; i < req.body.componentIds.length; i++) {
                        let newProductComp = {
                            productId: row.insertId, 
                            componentId: req.body.componentIds[i]
                        };
            
                        connection.query('INSERT INTO product_component SET ?', newProductComp, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({
                                    errorMessage: err,
                                    status: false
                                });
                            }
                        });
                    }

                    // Send success response after inserting product
                    res.status(200).json({
                        message: "Product and images inserted successfully",
                        id: row.insertId,
                        status: true
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
        connection.query("DELETE FROM product WHERE proId = ?", req.params.id, (err, row) => {
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