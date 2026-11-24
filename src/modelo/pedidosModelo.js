const pool = require('../config/bd');

class PedidosModelo {

    static async obtenerTodos() {
        const [rows] = await pool.query(`
            SELECT
                p.id_pedido,
                p.id_cliente,
                c.nombre AS cliente,
                p.id_empleado,
                p.fecha_pedido,
                p.estado,
                p.total
            FROM pedidos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
        `);
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.query(`
            SELECT
                p.id_pedido,
                p.id_cliente,
                c.nombre AS cliente,
                p.id_empleado,
                p.fecha_pedido,
                p.estado,
                p.total
            FROM pedidos p
            INNER JOIN clientes c ON p.id_cliente = c.id_cliente
            WHERE p.id_pedido = ?
        `, [id]);
        return rows[0];
    }

    static async crear(id_cliente, fecha_pedido) {
        const [result] = await pool.query(
            'INSERT INTO pedidos (id_cliente, fecha_pedido) VALUES (?, ?)',
            [id_cliente, fecha_pedido]
        );
        return { id_pedido: result.insertId, id_cliente, fecha_pedido };
    }

    static async actualizar(id, id_cliente, fecha_pedido) {
        const [result] = await pool.query(
            'UPDATE pedidos SET id_cliente = ?, fecha_pedido = ? WHERE id_pedido = ?',
            [id_cliente, fecha_pedido, id]
        );
        return result.affectedRows;
    }

    static async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = PedidosModelo;