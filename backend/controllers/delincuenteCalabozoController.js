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

const assignDelincuenteToCalabozo = async (req, res) => {
    const { CURP_Delincuente, Codigo_Calabozo } = req.body;

    if (!CURP_Delincuente || !Codigo_Calabozo) {
        return res.status(400).json({ message: 'El CURP del delincuente y el código del calabozo son requeridos' });
    }

    try {
        // Buscar el CURP encriptado del delincuente
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

        // Asignar el delincuente al calabozo usando el CURP encriptado
        const result = await connection.execute('INSERT INTO delincuente_calabozo (CURP_Delincuente, Codigo_Calabozo) VALUES (?, ?)', [delincuenteCURP, Codigo_Calabozo]);
        return res.status(201).json({ message: 'Delincuente asignado al calabozo exitosamente', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al asignar el delincuente al calabozo', error });
    }
};

module.exports = {
    assignDelincuenteToCalabozo,
};
