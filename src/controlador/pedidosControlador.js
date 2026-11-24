
const PedidosModelo = require('../modelo/pedidosModelo');
const pool = require('../config/bd');

class PedidosControlador {

    static async obtenerPedidos(req, res) {
        try {
            const datos = await PedidosModelo.obtenerTodos();
            res.status(200).json({ exito: true, datos });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener pedidos' });
        }
    }

    static async obtenerPedidoPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            const pedido = await PedidosModelo.obtenerPorId(id);

            if (!pedido) {
                return res.status(404).json({ mensaje: 'Pedido no encontrado' });
            }

            res.status(200).json({ exito: true, datos: pedido });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al buscar pedido' });
        }
    }

    static async crearPedido(req, res) {
        try {
            const { id_cliente, fecha } = req.body;

            if (!Number.isInteger(id_cliente) || id_cliente <= 0 || 
                typeof fecha !== 'string' || 
                !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
                Number.isNaN(Date.parse(fecha))) {
                return res.status(400).json({
                    mensaje: 'Se requiere un ID de cliente válido y una fecha YYYY-MM-DD'
                });
            }

            const [clientes] = await pool.query(
                'SELECT id_cliente FROM clientes WHERE id_cliente = ?',
                [id_cliente]
            );

            if (clientes.length === 0) {
                return res.status(404).json({ mensaje: 'El cliente no existe' });
            }

            const pedido = await PedidosModelo.crear(id_cliente, fecha);
            res.status(201).json({ exito: true, datos: pedido });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear pedido' });
        }
    }

    static async actualizarPedido(req, res) {
        try {
            const id = Number(req.params.id);
            const { id_cliente, fecha } = req.body;

            if (!Number.isInteger(id) || id <= 0 ||
                !Number.isInteger(id_cliente) || id_cliente <= 0 ||
                typeof fecha !== 'string' ||
                !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
                Number.isNaN(Date.parse(fecha))) {
                return res.status(400).json({ mensaje: 'Datos inválidos' });
            }

            const existe = await PedidosModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({ mensaje: 'Pedido no encontrado' });
            }

            const [clientes] = await pool.query(
                'SELECT id_cliente FROM clientes WHERE id_cliente = ?',
                [id_cliente]
            );

            if (clientes.length === 0) {
                return res.status(404).json({ mensaje: 'El cliente no existe' });
            }

            await PedidosModelo.actualizar(id, id_cliente, fecha);
            res.status(200).json({
                exito: true,
                mensaje: 'Pedido actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar pedido' });
        }
    }

    static async eliminarPedido(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            const existe = await PedidosModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({ mensaje: 'Pedido no encontrado' });
            }

            await PedidosModelo.eliminar(id);
            res.status(200).json({
                exito: true,
                mensaje: 'Pedido eliminado correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    mensaje: 'No se puede eliminar: el pedido tiene detalles asociados'
                });
            }
            res.status(500).json({ mensaje: 'Error al eliminar pedido' });
        }
    }
}

module.exports = PedidosControlador;
