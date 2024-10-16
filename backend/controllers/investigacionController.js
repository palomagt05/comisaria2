const crypto = require('crypto');
const pool = require('../database');

// Función para cifrar un texto
const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 32 bytes para AES-256
    const iv = crypto.randomBytes(16);  // 16 bytes para el IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { iv: iv.toString('hex'), encryptedData: encrypted, key: key.toString('hex') };
};

// Función para descifrar un texto cifrado
const decrypt = (encryptedData, iv, key) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const insertarInvestigacion = async (req, res) => {
    const { rfcPolicia, codigoCaso } = req.body;

    if (!rfcPolicia || !codigoCaso) {
        return res.status(400).json({ message: 'El RFC del policía y el Código del Caso son requeridos' });
    }

    try {
        // Buscar los RFCs encriptados de los policías en la base de datos
        const findPoliciaQuery = 'SELECT RFC, iv, llave FROM policias';
        const [policias] = await pool.query(findPoliciaQuery);

        // Verificar si algún RFC descifrado coincide con el RFC proporcionado
        let policiaFound = false;
        let rfcEncriptado;

        for (const policia of policias) {
            const decryptedRFC = decrypt(policia.RFC, policia.iv, policia.llave);
            if (decryptedRFC === rfcPolicia) {
                policiaFound = true;
                rfcEncriptado = policia.RFC;
                break;
            }
        }

        if (!policiaFound) {
            return res.status(404).json({ message: 'Policía no encontrado' });
        }

        // Insertar la información en la tabla investigacion usando el RFC encriptado
        const result = await pool.query('INSERT INTO investigacion (RFC_Policia, Codigo_Caso) VALUES (?, ?)', [rfcEncriptado, codigoCaso]);
        return res.status(201).json({ message: 'Investigación insertada exitosamente', result });
    } catch (error) {
        console.error('Error al insertar investigación:', error);
        return res.status(500).json({ message: 'Error al insertar investigación', error });
    }
};

module.exports = {
    insertarInvestigacion,
};
