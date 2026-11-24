
const ClientesModelo = require('../modelo/clientesModelo');

class ClientesControlador {
    static async obtenerClientes(req, res) {
        try {
            const datos = await ClientesModelo.obtenerTodos();
            res.status(200).json({ exito: true, datos });
        } catch (error) {
            res.status(500).json({ exito: false, mensaje: 'Error al obtener clientes' });
        }
    }

    static async obtenerClientePorId(req, res) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            const cliente = await ClientesModelo.obtenerPorId(id);
            if (!cliente) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }

            res.status(200).json({ exito: true, datos: cliente });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al buscar cliente' });
        }
    }

    static async crearCliente(req, res) {
        try {
            const { nombre, correo, telefono } = req.body;

            if (typeof nombre !== 'string' || !nombre.trim()) {
                return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
            }

            const cliente = await ClientesModelo.crear(
                nombre.trim(), correo || null, telefono || null
            );

            res.status(201).json({ exito: true, datos: cliente });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear cliente' });
        }
    }

    static async actualizarCliente(req, res) {
        try {
            const id = Number(req.params.id);
            const { nombre, correo, telefono } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            if (typeof nombre !== 'string' || !nombre.trim()) {
                return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
            }

            const existe = await ClientesModelo.obtenerPorId(id);
            if (!existe) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }

            await ClientesModelo.actualizar(
                id, nombre.trim(), correo || null, telefono || null
            );

            res.status(200).json({
                exito: true,
                mensaje: 'Cliente actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar cliente' });
        }
    }

    static async eliminarCliente(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ mensaje: 'ID inválido' });
            }

            const existe = await ClientesModelo.obtenerPorId(id);
            if (!existe) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }

            await ClientesModelo.eliminar(id);
            res.status(200).json({
                exito: true,
                mensaje: 'Cliente eliminado correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    mensaje: 'No se puede eliminar: el cliente tiene pedidos asociados'
                });
            }
            res.status(500).json({ mensaje: 'Error al eliminar cliente' });
        }
    }
}

module.exports = ClientesControlador;
