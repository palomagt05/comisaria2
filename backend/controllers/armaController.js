const connection = require('../database');

const addArma = async (req, res) => {
    try {
        const { codigo, clase, name } = req.body;

        // Ejecutar la consulta para insertar un nuevo usuario
        const query = `INSERT INTO armas (Codigo, Clase, Nombre) VALUES (?, ?, ?)`;
        const values = [codigo, clase, name];

        const [result] = await connection.execute(query, values);

        res.status(201).json({ message: 'Arma agregado con exito', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar', error });
    }
};
const getArmas = async (req, res) => {
    try {
        const query = `SELECT Codigo, Clase, Nombre FROM armas`;
        const [rows] = await connection.execute(query);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener armas', error });
    }
};

module.exports = {
    addArma,
    getArmas,
    // ... otros controladores
};
