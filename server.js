const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.')); // Serve จาก root directory

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'employee_directory',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

// ============== API Routes ==============

// GET all employees
app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM employees ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create new employee
app.post('/api/employees', async (req, res) => {
    try {
        const { firstName, lastName, position, department, email, phone, bio, profileImage } = req.body;
        
        if (!firstName || !lastName || !position || !department || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO employees 
            (first_name, last_name, position, department, email, phone, bio, profile_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, position, department, email, phone, bio, profileImage]
        );

        const [newEmployee] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newEmployee[0]);
    } catch (error) {
        console.error('Error creating employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, position, department, email, phone, bio, profileImage } = req.body;

        const [existing] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await pool.query(
            `UPDATE employees SET 
            first_name = ?, last_name = ?, position = ?, department = ?, 
            email = ?, phone = ?, bio = ?, profile_image = ?
            WHERE id = ?`,
            [firstName, lastName, position, department, email, phone, bio, profileImage, id]
        );

        const [updated] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );

        res.json(updated[0]);
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM employees WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ============== Start Server ==============
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 API endpoints:`);
    console.log(`   GET    http://localhost:${PORT}/api/employees`);
    console.log(`   GET    http://localhost:${PORT}/api/employees/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/employees`);
    console.log(`   PUT    http://localhost:${PORT}/api/employees/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/employees/:id`);
});