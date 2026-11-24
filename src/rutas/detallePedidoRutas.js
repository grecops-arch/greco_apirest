const express = require('express');
const router = express.Router();
const DetallePedidoControlador = require('../controlador/detallePedidoControlador');

// Rutas especiales (INNER JOIN por pedido y resúmenes agregados con GROUP BY)
router.get('/ventas-producto', DetallePedidoControlador.ventasPorProducto);
router.get('/ventas-categoria', DetallePedidoControlador.ventasPorCategoria);
router.get('/pedido/:id', DetallePedidoControlador.obtenerPorPedido);

// CRUD estándar
router.get('/', DetallePedidoControlador.obtenerTodos);
router.get('/:id', DetallePedidoControlador.obtenerPorId);
router.post('/', DetallePedidoControlador.crear);
router.put('/:id', DetallePedidoControlador.actualizar);
router.delete('/:id', DetallePedidoControlador.eliminar);

module.exports = router;