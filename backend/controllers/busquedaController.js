const crypto = require('crypto');
const connection = require('../database');

// Función para desencriptar datos
const decrypt = (encryptedData, iv, key) => {
    try {
        const algorithm = 'aes-256-cbc';
        const ivBuffer = Buffer.from(iv, 'hex');
        const keyBuffer = Buffer.from(key, 'hex');
        
        if (ivBuffer.length !== 16) {
            throw new Error('Invalid IV length');
        }

        const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar datos:', error);
        throw new Error('Error al desencriptar datos');
    }
};

// Función para obtener la ubicación del calabozo basado en el código del calabozo
const getUbicacion = async (codigoCalabozo) => {
    try {
        const [results] = await connection.execute('SELECT Codigo_Calabozo FROM delincuente_calabozo WHERE Codigo_Calabozo = ?', [codigoCalabozo]);
        return results[0]?.ubicacion || null;
    } catch (error) {
        console.error('Error al obtener la ubicación del calabozo:', error);
        throw new Error('Error al obtener la ubicación del calabozo');
    }
};

// Función para obtener la información de un caso basado en el código del caso
const getCaso = async (codigoCaso) => {
    try {
        const [results] = await connection.execute('SELECT * FROM caso_delincuente WHERE Codigo_Caso = ?', [codigoCaso]);
        return results[0] || null;
    } catch (error) {
        console.error('Error al obtener el caso:', error);
        throw new Error('Error al obtener el caso');
    }
};

// Buscar delincuentes por CURP, nombre o alias
const searchDelincuentes = async (req, res) => {
    const { searchQuery } = req.query;

    try {
        // Consulta para obtener todos los delincuentes
        const [delincuentesRows] = await connection.execute('SELECT * FROM delincuentes');

        // Consulta para obtener todos los casos de delincuentes con JOIN
        const [casosDelincuentesRows] = await connection.execute(`
            SELECT cd.Codigo_Caso, cd.CURP_Delincuente, cd.Juzgado 
            FROM caso_delincuente cd
            INNER JOIN delincuentes d ON d.CURP = cd.CURP_Delincuente
        `);

        // Consulta para obtener todos los registros de calabozo de delincuentes con JOIN
        const [delincuentesCalabozoRows] = await connection.execute(`
            SELECT dc.Codigo_Calabozo, dc.CURP_Delincuente 
            FROM delincuente_calabozo dc
            INNER JOIN delincuentes d ON d.CURP = dc.CURP_Delincuente
        `);

        // Consulta para obtener todos los registros de investigación
        const [investigacionesRows] = await connection.execute('SELECT * FROM investigacion');

        // Desencriptar y filtrar resultados de delincuentes
        const delincuentes = delincuentesRows.filter((delincuente) => {
            try {
                const decryptedCURP = decrypt(delincuente.CURP, delincuente.iv_curp, delincuente.llave_curp);
                const decryptedDireccion = decrypt(delincuente.Direccion, delincuente.iv_direccion, delincuente.llave_direccion);

                return (
                    decryptedCURP.includes(searchQuery) ||
                    delincuente.Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    delincuente.Alias?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            } catch (error) {
                console.error('Error al desencriptar datos del delincuente:', error);
                return false; // Excluir del resultado si hay un error
            }
        }).map((delincuente) => {
            try {
                const decryptedCURP = decrypt(delincuente.CURP, delincuente.iv_curp, delincuente.llave_curp);
                const decryptedDireccion = decrypt(delincuente.Direccion, delincuente.iv_direccion, delincuente.llave_direccion);
                return {
                    ...delincuente,
                    CURP: decryptedCURP,
                    Direccion: decryptedDireccion
                };
            } catch (error) {
                console.error('Error al procesar los datos del delincuente:', error);
                return delincuente; // Devolver datos no desencriptados si hay un error
            }
        });

        res.status(200).json({
            delincuentes,
            casosDelincuentes: casosDelincuentesRows,
            delincuentesCalabozo: delincuentesCalabozoRows,
            investigaciones: investigacionesRows
        });
    } catch (error) {
        console.error('Error en la búsqueda de delincuentes:', error);
        res.status(500).json({ message: 'Error al buscar delincuentes', error });
    }
};

module.exports = {
    searchDelincuentes,
    getUbicacion,
    getCaso
};
