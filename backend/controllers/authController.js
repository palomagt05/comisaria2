const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const secretKey = 'KKMJPKJAY'; 

const login = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE usuario = ?', [usuario]);
        const user = rows[0];
        console.log('Usuario encontrado en la base de datos');

        if (user && await bcrypt.compare(contrasena, user.contrasena)) { 
            const { id_cargo, nombre } = user;

            const token = jwt.sign({ id_cargo, nombre }, secretKey, { expiresIn: '1h' });

            let message = '';
            if (id_cargo === 1) {
                message = `Hola administrador, ${nombre}`;
            } else if (id_cargo === 2) {
                message = `Hola policia, ${nombre}`;
            }

            return res.status(200).json({ message, role: id_cargo, token });
        } else {
            console.log('Usuario o contraseña incorrectos');
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en el controlador de autenticación:', error);
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
};

module.exports = { login };
