const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('./connection');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
const { LocalStorage } = require('node-localstorage');
localStorage = new LocalStorage('./scratch')
router.use(bodyparser.json());

//login
exports.login = async (req, res) => {
    try {
        const { name, password, id } = req.body;
        if (!name || !password) {
            return res.status(400).send('Both username and password are required.');
        }
        const users = await pool.query('SELECT * FROM "Users" WHERE name = $1', [name]);
        if (users.rows.length === 0) return res.status(401).json({ error: "name is incorrect" });
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: "Incorrect password" });
        else {
            const tasks = await pool.query('SELECT "Note".*FROM "Note" JOIN "Users" ON "Note".id = "Users".id WHERE "Users".id = $1',[id]);
            console.log(tasks.rows)
        }
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}

//register
exports.register = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).send('Both username and password are required.');
        }

        //check if user already exists
        const existingUser = await pool.query('SELECT * FROM "Users" WHERE name = $1', [name])
        console.log(existingUser);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'name already exists' });
        }
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO "Users" (name,password) VALUES ($1,$2)', [name, hashedPassword]);

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
