const mysql = require('mysql2/promise'); // Usamos `promise` para usar async/await

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Asegúrate de que esta contraseña sea correcta
    database: 'comisaria'
});

connection.getConnection()
    .then(() => console.log('Conectado a la base de datos MySQL'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = connection;
