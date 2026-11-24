
const pool = require('../config/bd');

class ClientesModelo {
    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT * FROM clientes');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM clientes WHERE id_cliente = ?', [id]
        );
        return rows[0];
    }

    static async crear(nombre, correo, telefono) {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)',
            [nombre, correo, telefono]
        );
        return { id_cliente: result.insertId, nombre, correo, telefono };
    }

    static async actualizar(id, nombre, correo, telefono) {
        const [result] = await pool.query(
            'UPDATE clientes SET nombre = ?, correo = ?, telefono = ? WHERE id_cliente = ?',
            [nombre, correo, telefono, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM clientes WHERE id_cliente = ?', [id]
        );
        return result.affectedRows;
    }
}

module.exports = ClientesModelo;
