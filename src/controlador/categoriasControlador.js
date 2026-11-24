
const CategoriasModelo = require('../modelo/categoriasModelo');

class CategoriasControlador {

    static async obtenerCategorias(req, res) {
        try {
            const categorias = await CategoriasModelo.obtenerTodas();
            return res.status(200).json({
                exito: true,
                datos: categorias
            });
        } catch (error) {
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener las categorías'
            });
        }
    }

    static async obtenerCategoriaPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID debe ser un número válido'
                });
            }

            const categoria = await CategoriasModelo.obtenerPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Categoría no encontrada'
                });
            }

            return res.status(200).json({
                exito: true,
                datos: categoria
            });
        } catch (error) {
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener la categoría'
            });
        }
    }

    static async crearCategoria(req, res) {
        try {
            const { nombre, descripcion } = req.body;

            if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre de la categoría es obligatorio'
                });
            }

            const categoria = await CategoriasModelo.crear(
                nombre.trim(),
                descripcion || null
            );

            return res.status(201).json({
                exito: true,
                datos: categoria
            });
        } catch (error) {
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al crear la categoría'
            });
        }
    }

    static async actualizarCategoria(req, res) {
        try {
            const id = Number(req.params.id);
            const { nombre, descripcion } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID debe ser un número válido'
                });
            }

            if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre de la categoría es obligatorio'
                });
            }

            const existe = await CategoriasModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Categoría no encontrada'
                });
            }

            await CategoriasModelo.actualizar(
                id,
                nombre.trim(),
                descripcion || null
            );

            return res.status(200).json({
                exito: true,
                mensaje: 'Categoría actualizada correctamente'
            });
        } catch (error) {
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar la categoría'
            });
        }
    }

    static async eliminarCategoria(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID debe ser un número válido'
                });
            }

            const existe = await CategoriasModelo.obtenerPorId(id);

            if (!existe) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Categoría no encontrada'
                });
            }

            await CategoriasModelo.eliminar(id);

            return res.status(200).json({
                exito: true,
                mensaje: 'Categoría eliminada correctamente'
            });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'No se puede eliminar: hay productos asociados a esta categoría'
                });
            }

            return res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar la categoría'
            });
        }
    }
}

module.exports = CategoriasControlador;
