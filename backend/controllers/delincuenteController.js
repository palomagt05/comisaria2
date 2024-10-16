const crypto = require('crypto');
const connection = require('../database');

// Función para encriptar datos
const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 32 bytes para AES-256
    const iv = crypto.randomBytes(16);  // 16 bytes para el IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { iv: iv.toString('hex'), encryptedData: encrypted, key: key.toString('hex') };
};

// Función para desencriptar datos
const decrypt = (encryptedData, iv, key) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const addDelincuente = async (req, res) => {
    try {
        const { curp, name, tel, direccion } = req.body;

        // Verificar si el CURP ya existe
        const checkUserQuery = 'SELECT * FROM delincuentes WHERE CURP = ?';
        const [existingUser] = await connection.execute(checkUserQuery, [curp]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El CURP ya está registrado' });
        }

        // Encriptar CURP y dirección usando AES
        const encryptedCURP = encrypt(curp);
        const encryptedDireccion = encrypt(direccion);

        // Ejecutar la consulta para insertar un nuevo delincuente
        const query = `
            INSERT INTO delincuentes (
                CURP, Nombre, Telefono, Direccion,
                iv_curp, llave_curp, iv_direccion, llave_direccion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            encryptedCURP.encryptedData,
            name,
            tel,
            encryptedDireccion.encryptedData,
            encryptedCURP.iv,
            encryptedCURP.key,
            encryptedDireccion.iv,
            encryptedDireccion.key
        ];

        const [result] = await connection.execute(query, values);

        res.status(201).json({ message: 'Delincuente agregado con éxito', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar delincuente', error });
    }
};

const getDelincuentes = async (req, res) => {
    try {
        const query = 'SELECT CURP, Nombre, Telefono, Direccion, iv_curp, llave_curp, iv_direccion, llave_direccion FROM delincuentes';
        const [rows] = await connection.execute(query);

        const delincuentes = rows.map((delincuente) => {
            const decryptedCURP = decrypt(delincuente.CURP, delincuente.iv_curp, delincuente.llave_curp);
            const decryptedDireccion = decrypt(delincuente.Direccion, delincuente.iv_direccion, delincuente.llave_direccion);
            return {
                ...delincuente,
                CURP: decryptedCURP,
                Direccion: decryptedDireccion
            };
        });

        res.status(200).json(delincuentes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los delincuentes', error });
    }
};

module.exports = {
    addDelincuente,
    getDelincuentes,
};
