
const pool = require('../config/bd');

class CategoriasModelo {

    static async obtenerTodas() {
        const [rows] = await pool.query(
            'SELECT * FROM categorias'
        );
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM categorias WHERE id_categoria = ?',
            [id]
        );
        return rows[0];
    }

    static async crear(nombre, descripcion) {
        const [result] = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );

        return {
            id_categoria: result.insertId,
            nombre,
            descripcion
        };
    }

    static async actualizar(id, nombre, descripcion) {
        const [result] = await pool.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
            [nombre, descripcion, id]
        );

        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM categorias WHERE id_categoria = ?',
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = CategoriasModelo;
