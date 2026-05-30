"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itempedido_controller_1 = require("../controllers/itempedido.controller");
const auth_middleware_1 = require("../config/auth.middleware");
const router = (0, express_1.Router)();
router.get("/pedido/:id_pedido", auth_middleware_1.authMiddleware, itempedido_controller_1.listarItensDoPedido);
router.get("/:id", auth_middleware_1.authMiddleware, itempedido_controller_1.buscarItemPorId);
router.post("/pedido/:id_pedido", auth_middleware_1.authMiddleware, itempedido_controller_1.adicionarItem);
router.patch("/:id", auth_middleware_1.authMiddleware, itempedido_controller_1.atualizarQuantidadeItem);
router.delete("/:id", auth_middleware_1.authMiddleware, itempedido_controller_1.removerItem);
exports.default = router;
//# sourceMappingURL=itempedido.routes.js.map