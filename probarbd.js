require('dotenv').config();

const pool = require('./src/config/bd');

async function probarConexion() {
    try {
        const [resultado] = await pool.query(
            'SELECT VERSION() AS version, DATABASE() AS base_datos'
        );

        console.log('¡Conexión exitosa!');
        console.log(resultado[0]);

    } catch (error) {
        console.error('Error de conexión:', error.message);

    } finally {
        await pool.end();
    }
}

probarConexion();