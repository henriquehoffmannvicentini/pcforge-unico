"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_controller_1 = require("../controllers/categoria.controller");
const auth_middleware_1 = require("../config/auth.middleware");
const router = (0, express_1.Router)();
// Rotas publicas
router.get("/", categoria_controller_1.listarCategorias);
router.get("/:id", categoria_controller_1.buscarCategoria);
//  (somente admin)
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, categoria_controller_1.criarCategoria);
router.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, categoria_controller_1.atualizarCategoria);
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, categoria_controller_1.deletarCategoria);
exports.default = router;
//# sourceMappingURL=categoria.routes.js.map