"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const endereco_controller_1 = require("../controllers/endereco.controller");
const auth_middleware_1 = require("../config/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, endereco_controller_1.listarEnderecos);
router.get("/cliente/:id_cliente", auth_middleware_1.authMiddleware, (0, auth_middleware_1.selfOrAdminMiddleware)("id_cliente"), endereco_controller_1.listarEnderecosPorCliente);
router.get("/:id", auth_middleware_1.authMiddleware, endereco_controller_1.buscarEnderecoPorId);
router.post("/", auth_middleware_1.authMiddleware, endereco_controller_1.criarEndereco);
router.put("/:id", auth_middleware_1.authMiddleware, endereco_controller_1.atualizarEndereco);
router.delete("/:id", auth_middleware_1.authMiddleware, endereco_controller_1.deletarEndereco);
exports.default = router;
//# sourceMappingURL=endereco.routes.js.map