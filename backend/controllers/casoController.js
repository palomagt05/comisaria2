const crypto = require('crypto');
const connection = require('../database');

// Función para desencriptar datos
const decrypt = (encryptedData, iv, key) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const registerCase = async (req, res) => {
    const { Codigo_Caso, CURP_Delincuente, Juzgado } = req.body;

    if (!Codigo_Caso || !CURP_Delincuente || !Juzgado) {
        return res.status(400).json({ message: 'El Código del Caso, el CURP del delincuente y el Juzgado son requeridos' });
    }

    try {
        // Buscar el CURP encriptado de los delincuentes en la base de datos
        const findDelincuenteQuery = 'SELECT CURP, iv_curp, llave_curp FROM delincuentes';
        const [delincuentes] = await connection.execute(findDelincuenteQuery);

        // Verificar si algún CURP desencriptado coincide con el CURP proporcionado
        let delincuenteFound = false;
        let delincuenteCURP;

        for (const delincuente of delincuentes) {
            const decryptedCURP = decrypt(delincuente.CURP, delincuente.iv_curp, delincuente.llave_curp);
            if (decryptedCURP === CURP_Delincuente) {
                delincuenteFound = true;
                delincuenteCURP = delincuente.CURP;
                break;
            }
        }

        if (!delincuenteFound) {
            return res.status(404).json({ message: 'Delincuente no encontrado' });
        }

        // Registrar el caso en la base de datos usando el CURP encriptado
        const result = await connection.execute('INSERT INTO caso_delincuente (Codigo_Caso, CURP_Delincuente, Juzgado) VALUES (?, ?, ?)', [Codigo_Caso, delincuenteCURP, Juzgado]);
        return res.status(201).json({ message: 'Caso registrado exitosamente', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar el caso', error });
    }
};

module.exports = {
    registerCase,
};
