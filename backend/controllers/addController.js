const connection = require('../database');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
    try {
        const { username, password, role, name } = req.body;

        // Verificar si el nombre de usuario ya existe
        const checkUserQuery = 'SELECT * FROM users WHERE usuario = ?';
        const [existingUser] = await connection.execute(checkUserQuery, [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Encriptar la contraseña usando bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Ejecutar la consulta para insertar un nuevo usuario
        const query = `INSERT INTO users (usuario, contrasena, id_cargo, nombre) VALUES (?, ?, ?, ?)`;
        const values = [username, hashedPassword, role, name];

        const [result] = await connection.execute(query, values);

        res.status(201).json({ message: 'Usuario agregado con exito', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar usuario', error });
    }
};
const getUsers = async (req, res) => {
    try {
        const query = 'SELECT usuario, nombre, id_cargo FROM users';
        const [rows] = await connection.execute(query);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};
module.exports = {
    addUser,
    getUsers,
    // ... otros controladores
};
