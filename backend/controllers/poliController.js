const crypto = require('crypto');
const connection = require('../database');

const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 32 bytes para AES-256
    const iv = crypto.randomBytes(16);  // 16 bytes para el IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { iv: iv.toString('hex'), encryptedData: encrypted, key: key.toString('hex') };
};

const addPoli = async (req, res) => {
    try {
        const { rfc, role, name } = req.body;

        // Encriptar el RFC usando AES
        const encryptedRFC = encrypt(rfc);

        // Ejecutar la consulta para insertar un nuevo usuario
        const query = `INSERT INTO policias (RFC, Nombre, Categoria, iv, llave) VALUES (?, ?, ?, ?, ?)`;
        const values = [encryptedRFC.encryptedData, name, role, encryptedRFC.iv, encryptedRFC.key];

        const [result] = await connection.execute(query, values);

        res.status(201).json({ message: 'Policia agregado con exito', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar', error });
    }
};
const decrypt = (encryptedData, iv, key) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const getPolis = async (req, res) => {
    try {
        const query = `SELECT RFC, Nombre, Categoria, iv, llave FROM policias`;
        const [rows] = await connection.execute(query);

        const policias = rows.map((policia) => {
            const decryptedRFC = decrypt(policia.RFC, policia.iv, policia.llave);
            return {
                ...policia,
                RFC: decryptedRFC
            };
        });

        res.status(200).json(policias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los policías', error });
    }
};

module.exports = {
    addPoli,
    getPolis,
    // ... otros controladores
};

