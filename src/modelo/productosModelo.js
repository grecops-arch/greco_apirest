
const pool = require('../config/bd');

class ProductosModelo {

    static async obtenerTodos() {
        const [rows] = await pool.query(`
            SELECT p.id_producto, p.nombre, p.precio,
                   p.id_categoria, c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
        `);
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query(`
            SELECT p.id_producto, p.nombre, p.precio,
                   p.id_categoria, c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ?
        `, [id]);

        return rows[0];
    }

    static async crear(id_categoria, nombre, precio) {
        const [result] = await pool.query(
            'INSERT INTO productos (id_categoria, nombre, precio) VALUES (?, ?, ?)',
            [id_categoria, nombre, precio]
        );

        return {
            id_producto: result.insertId,
            id_categoria,
            nombre,
            precio
        };
    }

    static async actualizar(id, id_categoria, nombre, precio) {
        const [result] = await pool.query(
            `UPDATE productos
             SET id_categoria = ?, nombre = ?, precio = ?
             WHERE id_producto = ?`,
            [id_categoria, nombre, precio, id]
        );

        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM productos WHERE id_producto = ?',
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ProductosModelo;
