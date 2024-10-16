// controllers/hanilidadesController.js
const pool = require('../database');
const bcrypt = require('bcrypt');

const insertarHabilidad = async (req, res) => {
    const { rfcPolicia, codigoArma, habilidad } = req.body;

    if (!rfcPolicia || !codigoArma || !habilidad) {
        return res.status(400).json({ message: 'El RFC del policía, el Código del Arma y la Habilidad son requeridos' });
    }

    try {
        // Buscar el RFC encriptado de los policías en la base de datos
        const findPoliciaQuery = 'SELECT RFC FROM policias';
        const [policias] = await pool.query(findPoliciaQuery);

        // Verificar si algún RFC encriptado coincide con el RFC proporcionado
        let policiaFound = false;
        let rfcEncriptado;

        for (const policia of policias) {
            const match = await bcrypt.compare(rfcPolicia, policia.RFC);
            if (match) {
                policiaFound = true;
                rfcEncriptado = policia.RFC;
                break;
            }
        }

        if (!policiaFound) {
            return res.status(404).json({ message: 'Policía no encontrado' });
        }

        // Insertar la habilidad en la tabla hanilidades usando el RFC encriptado
        const result = await pool.query('INSERT INTO habilidades (RFC_Policia, Codigo_Arma, Habilidad) VALUES (?, ?, ?)', [rfcEncriptado, codigoArma, habilidad]);
        return res.status(201).json({ message: 'Habilidad insertada exitosamente', result });
    } catch (error) {
        console.error('Error al insertar habilidad:', error);
        return res.status(500).json({ message: 'Error al insertar habilidad', error });
    }
};

module.exports = {
    insertarHabilidad,
};
