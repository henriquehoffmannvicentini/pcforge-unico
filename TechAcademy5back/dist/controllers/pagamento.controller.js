"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmarPagamentoMercadoPago = exports.gerarNovaPreferenciaMercadoPago = exports.iniciarCheckoutMercadoPago = void 0;
const pedido_service_1 = require("../services/pedido.service");
const mercadoPago_service_1 = require("../services/mercadoPago.service");
function getAuthenticatedClienteId(req) {
    const idCliente = req.cliente?.id_cliente;
    if (!idCliente) {
        throw new pedido_service_1.HttpError(401, "Usuario nao autenticado.");
    }
    return idCliente;
}
function handleControllerError(res, error, fallbackMessage) {
    if (error instanceof pedido_service_1.HttpError) {
        res.status(error.statusCode).json({ mensagem: error.message });
        return;
    }
    console.error(fallbackMessage, error);
    res.status(500).json({ mensagem: fallbackMessage });
}
const iniciarCheckoutMercadoPago = async (req, res) => {
    try {
        const idCliente = getAuthenticatedClienteId(req);
        const isAdmin = req.cliente?.admin === true;
        const { id_endereco_entrega, itens, frontend_url } = req.body;
        const pedido = await (0, pedido_service_1.criarPedidoComItens)({
            id_cliente: idCliente,
            id_endereco_entrega: Number(id_endereco_entrega),
            metodo: "mercado_pago",
            itens,
        }, isAdmin);
        const preferencia = await (0, mercadoPago_service_1.criarPreferenciaMercadoPago)(pedido, frontend_url);
        const preferenciaPayload = preferencia && typeof preferencia === "object" && !Array.isArray(preferencia)
            ? preferencia
            : {};
        res.status(201).json({
            mensagem: "Pedido criado e checkout do Mercado Pago iniciado.",
            pedido,
            ...preferenciaPayload,
        });
    }
    catch (error) {
        handleControllerError(res, error, "Erro interno ao iniciar checkout com Mercado Pago.");
    }
};
exports.iniciarCheckoutMercadoPago = iniciarCheckoutMercadoPago;
const gerarNovaPreferenciaMercadoPago = async (req, res) => {
    try {
        const idCliente = getAuthenticatedClienteId(req);
        const isAdmin = req.cliente?.admin === true;
        const idPedido = Number(req.params.id);
        const { frontend_url } = req.body;
        if (!Number.isInteger(idPedido) || idPedido < 1) {
            res.status(400).json({ mensagem: "ID do pedido invalido." });
            return;
        }
        const pedido = await (0, pedido_service_1.carregarPedidoDetalhadoDoCliente)(idPedido, idCliente, isAdmin);
        if (pedido.status === "pago") {
            res.status(409).json({ mensagem: "Este pedido ja foi pago." });
            return;
        }
        if (pedido.status === "cancelado" || pedido.status === "entregue") {
            res.status(409).json({
                mensagem: `Nao e possivel gerar pagamento para um pedido com status "${pedido.status}".`,
            });
            return;
        }
        const preferencia = await (0, mercadoPago_service_1.criarPreferenciaMercadoPago)(pedido, frontend_url);
        const preferenciaPayload = preferencia && typeof preferencia === "object" && !Array.isArray(preferencia)
            ? preferencia
            : {};
        res.status(200).json({
            mensagem: "Novo link do Mercado Pago gerado com sucesso.",
            pedido,
            ...preferenciaPayload,
        });
    }
    catch (error) {
        handleControllerError(res, error, "Erro interno ao gerar um novo link do Mercado Pago.");
    }
};
exports.gerarNovaPreferenciaMercadoPago = gerarNovaPreferenciaMercadoPago;
const confirmarPagamentoMercadoPago = async (req, res) => {
    try {
        const idCliente = getAuthenticatedClienteId(req);
        const isAdmin = req.cliente?.admin === true;
        const idPedido = Number(req.body.pedido_id);
        const paymentId = req.body.payment_id !== null &&
            req.body.payment_id !== undefined &&
            req.body.payment_id !== ""
            ? Number(req.body.payment_id)
            : null;
        const fallbackStatus = String(req.body.status || "").trim().toLowerCase();
        if (!Number.isInteger(idPedido) || idPedido < 1) {
            res.status(400).json({ mensagem: "pedido_id invalido." });
            return;
        }
        if (paymentId !== null && (!Number.isInteger(paymentId) || paymentId < 1)) {
            res.status(400).json({ mensagem: "payment_id invalido." });
            return;
        }
        const pedido = await (0, pedido_service_1.carregarPedidoDetalhadoDoCliente)(idPedido, idCliente, isAdmin);
        let paymentStatus = fallbackStatus || "pending";
        let paymentDetails = null;
        if (paymentId) {
            const paymentResponse = await (0, mercadoPago_service_1.buscarPagamentoMercadoPago)(paymentId);
            if (!paymentResponse ||
                typeof paymentResponse !== "object" ||
                Array.isArray(paymentResponse)) {
                throw new pedido_service_1.HttpError(502, "Mercado Pago retornou um payload invalido ao consultar o pagamento.");
            }
            paymentDetails = paymentResponse;
            const returnedStatus = typeof paymentDetails.status === "string"
                ? paymentDetails.status
                : paymentStatus || "pending";
            paymentStatus = String(returnedStatus || "pending").toLowerCase();
            const externalReference = typeof paymentDetails.external_reference === "string"
                ? paymentDetails.external_reference
                : "";
            if (externalReference && externalReference !== String(pedido.id_pedido)) {
                res.status(409).json({
                    mensagem: "O pagamento retornado nao pertence ao pedido informado.",
                });
                return;
            }
        }
        let pedidoAtualizado = pedido;
        if (paymentId && paymentStatus === "approved" && pedido.status !== "pago") {
            await pedido.update({
                status: "pago",
                data_pagamento: new Date(),
            });
            pedidoAtualizado =
                (await (0, pedido_service_1.carregarPedidoDetalhadoDoCliente)(idPedido, idCliente, isAdmin)) || pedido;
        }
        res.status(200).json({
            mensagem: "Status do pagamento consultado com sucesso.",
            paymentStatus,
            paymentId,
            verifiedWithMercadoPago: Boolean(paymentDetails),
            pedido: pedidoAtualizado,
        });
    }
    catch (error) {
        handleControllerError(res, error, "Erro interno ao confirmar pagamento com Mercado Pago.");
    }
};
exports.confirmarPagamentoMercadoPago = confirmarPagamentoMercadoPago;
//# sourceMappingURL=pagamento.controller.js.map