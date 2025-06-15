const bcrypt = require('bcrypt');
const pool = require('../db.js');
const jwt = require('jsonwebtoken');

// Helper function
function checkUserAndGenerateToken(user, res) {
    jwt.sign({ user: user.username, role: user.role, id: user.id }, 'shhhhh11111', { expiresIn: '2d' }, (err, token) => {
        if (err) {
            res.status(400).json({
                status: false,
                errorMessage: err,
            });
        } else {
            res.status(200).json({
                message: 'Login Successfully.',
                id: user.id,
                token: token,
                role: user.role,
                status: true
            });
        }
    });
}

// Get all users
exports.getAll = async (req, res) => {
    try {
        pool.query('SELECT * FROM users', (err, results) => {
            if (err) throw err;

            res.status(200).json({
                status: 'success',
                total: results.length,
                data: { users: results }
            });
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Get one user
exports.getOne = async (req, res) => {
    try {
        pool.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, results) => {
            if (err) throw err;

            res.status(200).json({
                status: 'success',
                data: { user: results[0] || null }
            });
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Update user
exports.update = async (req, res) => {
    const { name, email, phone, birthDate, billingAddress } = req.body;
    const { id } = req.params;

    if (!name || !email || !phone || !birthDate || !billingAddress) {
        return res.status(400).json({ status: false, errorMessage: 'Missing required fields' });
    }

    try {
        const sql = `
            UPDATE users
            SET name = $1, email = $2, phone = $3, birthDate = $4, billingAddress = $5
            WHERE id = $6
        `;
        const values = [name, email, phone, birthDate, billingAddress, id];

        pool.query(sql, values, (err) => {
            if (err) return res.status(500).json({ status: false, errorMessage: err.message });

            res.status(200).json({ status: true, title: 'Updated successfully' });
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Update avatar
exports.updateAvatar = async (req, res) => {
    const { avatar } = req.body;
    const { id } = req.params;

    if (!avatar) {
        return res.status(400).json({ status: false, errorMessage: 'Missing avatar' });
    }

    try {
        pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatar, id], (err) => {
            if (err) return res.status(500).json({ status: false, errorMessage: err.message });

            res.status(200).json({ status: true, title: 'Avatar updated successfully' });
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Register
exports.register = async (req, res) => {
    const { username, password, fullName, email, phone} = req.body;

    if (!username || !password || !fullName || !email || !phone) {
        return res.status(400).json({ status: false, errorMessage: 'Missing required fields' });
    }

    try {
        pool.query('SELECT * FROM users WHERE username = $1', [username], async (err, results) => {
            if (err) return res.status(500).json({ status: false, errorMessage: err.message });

            if (results.rows.length > 0) {
                return res.status(400).json({ status: false, errorMessage: 'Username already exists' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newUser = { username, password: hashedPassword, fullName, email, phone};

            pool.query(
            'INSERT INTO users (username, password, fullname, email, phone) VALUES ($1, $2, $3, $4, $5)',
            [username, hashedPassword, fullName, email, phone],
            (err) => {
                if (err) return res.status(500).json({ status: false, errorMessage: err.message });

                res.status(200).json({ status: true, title: 'Registered successfully' });
            }
            );
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Google login
exports.loginGoogle = async (req, res) => {
    const { username, password, name, email, avatar } = req.body;

    if (!username || !password || !email || !avatar) {
        return res.status(400).json({ status: false, errorMessage: 'Missing required fields' });
    }

    try {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (err, results) => {
            if (err) return res.status(500).json({ status: false, errorMessage: err.message });

            if (results.length === 0) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                const newUser = { username, password: hashedPassword, name, email, avatar };

                pool.query('INSERT INTO users SET $1', newUser, (err, result) => {
                    if (err) return res.status(500).json({ status: false, errorMessage: err.message });

                    checkUserAndGenerateToken({ username, id: result.insertId }, res);
                });
            } else {
                checkUserAndGenerateToken({ username, id: results[0].id }, res);
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    const token = req.header('Token');

    if (!token) return res.status(400).json({ status: false, errorMessage: 'Token missing' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        pool.query('SELECT * FROM users WHERE username = $1', [decoded.user], (err, results) => {
            if (err) return res.status(500).json({ status: false, message: err.message });

            if (results.rows.length === 0) {
                return res.status(404).json({ status: false, errorMessage: 'User not found' });
            }

            res.status(200).json({
                status: 'success',
                data: { user: results.rows[0] }
            });
        });
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
};

// Delete user
exports.delete = async (req, res) => {
    try {
        pool.query('DELETE FROM users WHERE id = $1', [req.params.id], (err) => {
            if (err) return res.status(500).json({ status: false, errorMessage: err.message });

            res.status(200).json({ status: true, title: 'Deleted successfully' });
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: false, errorMessage: 'Missing username or password' });
    }

    try {
        pool.query('SELECT * FROM users WHERE username = $1', [username], async (err, results) => {
            if (err) return res.status(500).json({ status: 'fail', message: err.message });

            if (!results.rows.length) return res.status(400).json({ status: false, errorMessage: 'No user found' });

            const user = results.rows[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ status: false, errorMessage: 'Invalid credentials' });
            
            checkUserAndGenerateToken({ username: user.username, userId: user.id, role:user.role }, res);
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    const { username, id, password, newPassword } = req.body;

    if (!username || !id || !password || !newPassword) {
        return res.status(400).json({ status: false, errorMessage: 'Missing required fields' });
    }

    try {
        pool.query('SELECT * FROM users WHERE id = $1', [id], async (err, results) => {
            if (err) return res.status(500).json({ status: 'fail', message: err.message });

            if (!results.length) return res.status(400).json({ status: false, errorMessage: 'User not found' });

            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ status: false, errorMessage: 'Incorrect current password' });

            const salt = bcrypt.genSaltSync(10);
            const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

            pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, id], (err) => {
                if (err) return res.status(500).json({ status: false, errorMessage: err.message });

                res.status(200).json({ status: true, title: 'Password changed successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};
