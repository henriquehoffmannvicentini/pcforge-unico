"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../config/auth.middleware");
const pagamento_controller_1 = require("../controllers/pagamento.controller");
const router = (0, express_1.Router)();
router.post("/mercado-pago/checkout", auth_middleware_1.authMiddleware, pagamento_controller_1.iniciarCheckoutMercadoPago);
router.post("/mercado-pago/pedido/:id/preference", auth_middleware_1.authMiddleware, pagamento_controller_1.gerarNovaPreferenciaMercadoPago);
router.post("/mercado-pago/confirmar", auth_middleware_1.authMiddleware, pagamento_controller_1.confirmarPagamentoMercadoPago);
exports.default = router;
//# sourceMappingURL=pagamento.routes.js.map