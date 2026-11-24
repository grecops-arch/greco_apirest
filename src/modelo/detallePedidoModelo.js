const pool = require('../config/bd');

class DetallePedidoModelo {

    // Todos los detalles con INNER JOIN (detalle_pedido + productos + pedidos)
    static async obtenerTodos() {
        const [rows] = await pool.query(`
            SELECT
                d.id_detalle,
                d.id_pedido,
                pe.estado AS estado_pedido,
                d.id_producto,
                p.nombre AS producto,
                d.cantidad,
                d.precio_unitario,
                d.subtotal
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN pedidos pe
                ON d.id_pedido = pe.id_pedido
            ORDER BY d.id_detalle ASC
        `);
        return rows;
    }

    // Un detalle por id_detalle
    static async obtenerPorId(id) {
        const [rows] = await pool.query(`
            SELECT
                d.id_detalle,
                d.id_pedido,
                pe.estado AS estado_pedido,
                d.id_producto,
                p.nombre AS producto,
                d.cantidad,
                d.precio_unitario,
                d.subtotal
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN pedidos pe
                ON d.id_pedido = pe.id_pedido
            WHERE d.id_detalle = ?
        `, [id]);
        return rows[0];
    }

    // Crear detalle de pedido
    static async crear(id_pedido, id_producto, cantidad, precio_unitario) {
        const [result] = await pool.query(
            `INSERT INTO detalle_pedido
             (id_pedido, id_producto, cantidad, precio_unitario)
             VALUES (?, ?, ?, ?)`,
            [id_pedido, id_producto, cantidad, precio_unitario]
        );

        return {
            id_detalle: result.insertId,
            id_pedido,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal: Number((cantidad * precio_unitario).toFixed(2))
        };
    }

    // Actualizar detalle de pedido
    static async actualizar(id, id_pedido, id_producto, cantidad, precio_unitario) {
        const [result] = await pool.query(
            `UPDATE detalle_pedido
             SET id_pedido = ?,
                 id_producto = ?,
                 cantidad = ?,
                 precio_unitario = ?
             WHERE id_detalle = ?`,
            [id_pedido, id_producto, cantidad, precio_unitario, id]
        );
        return result.affectedRows;
    }

    // Eliminar detalle de pedido
    static async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM detalle_pedido WHERE id_detalle = ?',
            [id]
        );
        return result.affectedRows;
    }

    // Consigna 4.5: Detalle de un pedido (nombre de producto, cantidad y precio) con INNER JOIN
    static async obtenerPorPedido(id_pedido) {
        const [rows] = await pool.query(`
            SELECT
                d.id_detalle,
                d.id_pedido,
                pe.fecha_pedido,
                pe.estado,
                p.id_producto,
                p.nombre AS producto,
                d.cantidad,
                d.precio_unitario AS precio,
                d.subtotal
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN pedidos pe
                ON d.id_pedido = pe.id_pedido
            WHERE d.id_pedido = ?
            ORDER BY d.id_detalle ASC
        `, [id_pedido]);

        return rows;
    }

    // Consigna 4.5: Resumen agregado con INNER JOIN + GROUP BY por producto
    static async obtenerVentasPorProducto() {
        const [rows] = await pool.query(`
            SELECT
                p.id_producto,
                p.nombre AS producto,
                SUM(d.cantidad) AS unidades_vendidas,
                SUM(d.subtotal) AS total_vendido
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN pedidos pe
                ON d.id_pedido = pe.id_pedido
            GROUP BY p.id_producto, p.nombre
            ORDER BY total_vendido DESC
        `);
        return rows;
    }

    // Consigna 4.5: Resumen agregado con INNER JOIN + GROUP BY por categoría
    static async obtenerVentasPorCategoria() {
        const [rows] = await pool.query(`
            SELECT
                c.id_categoria,
                c.nombre AS categoria,
                SUM(d.cantidad) AS unidades_vendidas,
                SUM(d.subtotal) AS total_vendido
            FROM detalle_pedido d
            INNER JOIN productos p
                ON d.id_producto = p.id_producto
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            GROUP BY c.id_categoria, c.nombre
            ORDER BY total_vendido DESC
        `);
        return rows;
    }
}

module.exports = DetallePedidoModelo;