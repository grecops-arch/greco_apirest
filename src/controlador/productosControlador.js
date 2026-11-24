
const ProductosModelo = require('../modelo/productosModelo');
const pool = require('../config/bd');

class ProductosControlador {

    static async obtenerProductos(req, res) {
        try {
            const datos = await ProductosModelo.obtenerTodos();
            res.status(200).json({ exito: true, datos });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener productos'
            });
        }
    }

    static async obtenerProductoPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'ID inválido'
                });
            }

            const producto = await ProductosModelo.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            res.status(200).json({ exito: true, datos: producto });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al buscar producto'
            });
        }
    }

    static async crearProducto(req, res) {
        try {
            const { id_categoria, nombre, precio } = req.body;

            if (!Number.isInteger(id_categoria) || id_categoria <= 0 ||
                typeof nombre !== 'string' || !nombre.trim() ||
                typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
                return res.status(400).json({
                    mensaje: 'Se requiere categoría, nombre y precio válidos'
                });
            }

            const [categorias] = await pool.query(
                'SELECT id_categoria FROM categorias WHERE id_categoria = ?',
                [id_categoria]
            );

            if (categorias.length === 0) {
                return res.status(404).json({
                    mensaje: 'La categoría no existe'
                });
            }

            const producto = await ProductosModelo.crear(
                id_categoria, nombre.trim(), precio
            );

            res.status(201).json({
                exito: true,
                datos: producto
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al crear producto'
            });
        }
    }

    static async actualizarProducto(req, res) {
        try {
            const id = Number(req.params.id);
            const { id_categoria, nombre, precio } = req.body;

            if (!Number.isInteger(id) || id <= 0 ||
                !Number.isInteger(id_categoria) || id_categoria <= 0 ||
                typeof nombre !== 'string' || !nombre.trim() ||
                typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
                return res.status(400).json({
                    mensaje: 'Datos inválidos'
                });
            }

            const existe = await ProductosModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            const [categorias] = await pool.query(
                'SELECT id_categoria FROM categorias WHERE id_categoria = ?',
                [id_categoria]
            );

            if (categorias.length === 0) {
                return res.status(404).json({
                    mensaje: 'La categoría no existe'
                });
            }

            await ProductosModelo.actualizar(
                id, id_categoria, nombre.trim(), precio
            );

            res.status(200).json({
                exito: true,
                mensaje: 'Producto actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar producto'
            });
        }
    }

    static async eliminarProducto(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'ID inválido'
                });
            }

            const existe = await ProductosModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            await ProductosModelo.eliminar(id);

            res.status(200).json({
                exito: true,
                mensaje: 'Producto eliminado correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    mensaje: 'No se puede eliminar: el producto está asociado a un pedido'
                });
            }

            res.status(500).json({
                mensaje: 'Error al eliminar producto'
            });
        }
    }
}

module.exports = ProductosControlador;
