const crypto = require('crypto');
const pool = require('../database');

const decrypt = (encryptedData, iv, key) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const insertarJefe = async (req, res) => {
    const { rfcJefe, rfcSubordinados, categoriaJefe } = req.body;

    if (!rfcJefe || !rfcSubordinados || !categoriaJefe) {
        return res.status(400).json({ message: 'El RFC del jefe, al menos un subordinado y la categoría del jefe son requeridos' });
    }

    try {
        // Buscar los RFCs encriptados de los policías en la base de datos
        const findPoliciasQuery = 'SELECT RFC, iv, llave FROM policias';
        const [policias] = await pool.query(findPoliciasQuery);

        // Desencriptar los RFCs y verificar si coinciden
        const rfcEncriptadoMap = new Map();
        let jefeFound = false;
        let rfcEncriptadoJefe;

        for (const policia of policias) {
            const decryptedRFC = decrypt(policia.RFC, policia.iv, policia.llave);
            rfcEncriptadoMap.set(decryptedRFC, policia.RFC);

            if (decryptedRFC === rfcJefe) {
                jefeFound = true;
                rfcEncriptadoJefe = policia.RFC;
            }
        }

        if (!jefeFound) {
            return res.status(404).json({ message: 'Jefe no encontrado' });
        }

        const rfcSubordinadosArray = rfcSubordinados.split(',');
        const rfcEncriptadoSubordinados = [];

        for (const rfcSubordinado of rfcSubordinadosArray) {
            if (rfcEncriptadoMap.has(rfcSubordinado)) {
                rfcEncriptadoSubordinados.push(rfcEncriptadoMap.get(rfcSubordinado));
            } else {
                return res.status(404).json({ message: `Subordinado con RFC ${rfcSubordinado} no encontrado` });
            }
        }

        // Insertar la información en la tabla jefes usando los RFCs encriptados
        for (const rfcSubordinado of rfcEncriptadoSubordinados) {
            await pool.query('INSERT INTO jefe (RFC_Jefe, RFC_Subordinado, Categoria) VALUES (?, ?, ?)', [rfcEncriptadoJefe, rfcSubordinado, categoriaJefe]);
        }

        return res.status(201).json({ message: 'Relación de jefe y subordinados insertada exitosamente' });
    } catch (error) {
        console.error('Error al insertar relación de jefe y subordinado:', error);
        return res.status(500).json({ message: 'Error al insertar relación de jefe y subordinado', error });
    }
};

module.exports = {
    insertarJefe,
};
