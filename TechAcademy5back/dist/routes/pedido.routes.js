"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedido_controller_1 = require("../controllers/pedido.controller");
const auth_middleware_1 = require("../config/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, pedido_controller_1.listarPedidos);
router.get("/cliente/:id_cliente", auth_middleware_1.authMiddleware, (0, auth_middleware_1.selfOrAdminMiddleware)("id_cliente"), pedido_controller_1.listarPedidosPorCliente);
router.get("/:id", auth_middleware_1.authMiddleware, pedido_controller_1.buscarPedidoPorId);
router.post("/", auth_middleware_1.authMiddleware, pedido_controller_1.criarPedido);
router.patch("/:id/status", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, pedido_controller_1.atualizarStatusPedido);
router.patch("/:id/cancelar", auth_middleware_1.authMiddleware, pedido_controller_1.cancelarPedido);
exports.default = router;
//# sourceMappingURL=pedido.routes.js.map