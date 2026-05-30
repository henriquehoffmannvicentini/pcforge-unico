"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarPedido = exports.atualizarStatusPedido = exports.criarPedido = exports.buscarPedidoPorId = exports.listarPedidosPorCliente = exports.listarPedidos = void 0;
const Pedido_1 = __importDefault(require("../models/Pedido"));
const Itempedido_1 = __importDefault(require("../models/Itempedido"));
const Produto_1 = __importDefault(require("../models/Produto"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const Endereco_1 = __importDefault(require("../models/Endereco"));
const pagination_1 = require("../utils/pagination");
const pedido_service_1 = require("../services/pedido.service");
const getClienteAutenticado = (req, res) => {
    if (!req.cliente) {
        res.status(401).json({ mensagem: "Usuario nao autenticado." });
        return null;
    }
    return req.cliente;
};
const listarPedidos = async (req, res) => {
    try {
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const baseOptions = {
            include: [
                {
                    model: Cliente_1.default,
                    as: "cliente",
                    attributes: ["id_cliente", "nome", "email"],
                },
                {
                    model: Endereco_1.default,
                    as: "endereco_entrega",
                },
                {
                    model: Itempedido_1.default,
                    as: "itens",
                    include: [
                        {
                            model: Produto_1.default,
                            as: "produto",
                            attributes: ["id_produto", "nome", "valor"],
                        },
                    ],
                },
            ],
            order: [["data_pedido", "DESC"]],
            distinct: true,
        };
        const { rows: pedidos, count } = shouldPaginate
            ? await Pedido_1.default.findAndCountAll({
                ...baseOptions,
                limit,
                offset,
            })
            : await Pedido_1.default.findAndCountAll(baseOptions);
        res
            .status(200)
            .json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(pedidos, count, page, limit) : pedidos);
    }
    catch (error) {
        console.error("Erro ao listar pedidos:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar pedidos." });
    }
};
exports.listarPedidos = listarPedidos;
const listarPedidosPorCliente = async (req, res) => {
    try {
        const id_cliente = Number(req.params.id_cliente);
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const baseOptions = {
            where: { id_cliente },
            include: [
                {
                    model: Endereco_1.default,
                    as: "endereco_entrega",
                },
                {
                    model: Itempedido_1.default,
                    as: "itens",
                    include: [
                        {
                            model: Produto_1.default,
                            as: "produto",
                            attributes: ["id_produto", "nome", "valor", "imagem"],
                        },
                    ],
                },
            ],
            order: [["data_pedido", "DESC"]],
            distinct: true,
        };
        const { rows: pedidos, count } = shouldPaginate
            ? await Pedido_1.default.findAndCountAll({
                ...baseOptions,
                limit,
                offset,
            })
            : await Pedido_1.default.findAndCountAll(baseOptions);
        res
            .status(200)
            .json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(pedidos, count, page, limit) : pedidos);
    }
    catch (error) {
        console.error("Erro ao listar pedidos do cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar pedidos do cliente." });
    }
};
exports.listarPedidosPorCliente = listarPedidosPorCliente;
const buscarPedidoPorId = async (req, res) => {
    try {
        const id_pedido = Number(req.params.id);
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        const pedido = await Pedido_1.default.findByPk(id_pedido, {
            include: [
                {
                    model: Cliente_1.default,
                    as: "cliente",
                    attributes: ["id_cliente", "nome", "email", "telefone"],
                },
                {
                    model: Endereco_1.default,
                    as: "endereco_entrega",
                },
                {
                    model: Itempedido_1.default,
                    as: "itens",
                    include: [
                        {
                            model: Produto_1.default,
                            as: "produto",
                            attributes: ["id_produto", "nome", "valor", "imagem"],
                        },
                    ],
                },
            ],
        });
        if (!pedido) {
            res.status(404).json({ mensagem: "Pedido nao encontrado." });
            return;
        }
        if (!clienteLogado.admin && pedido.id_cliente !== clienteLogado.id_cliente) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para acessar este pedido." });
            return;
        }
        res.status(200).json(pedido);
    }
    catch (error) {
        console.error("Erro ao buscar pedido:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar pedido." });
    }
};
exports.buscarPedidoPorId = buscarPedidoPorId;
const criarPedido = async (req, res) => {
    try {
        const clienteAutenticado = req.cliente;
        const isAdmin = clienteAutenticado?.admin === true;
        const idCliente = isAdmin && req.body.id_cliente
            ? Number(req.body.id_cliente)
            : Number(clienteAutenticado?.id_cliente);
        if (!idCliente) {
            res.status(401).json({ mensagem: "Usuario nao autenticado." });
            return;
        }
        const pedidoCriado = await (0, pedido_service_1.criarPedidoComItens)({
            id_cliente: idCliente,
            id_endereco_entrega: Number(req.body.id_endereco_entrega),
            metodo: req.body.metodo || null,
            itens: req.body.itens,
        }, isAdmin);
        res.status(201).json({ mensagem: "Pedido criado com sucesso.", pedido: pedidoCriado });
    }
    catch (error) {
        if (error instanceof pedido_service_1.HttpError) {
            res.status(error.statusCode).json({ mensagem: error.message });
            return;
        }
        console.error("Erro ao criar pedido:", error);
        res.status(500).json({ mensagem: "Erro interno ao criar pedido." });
    }
};
exports.criarPedido = criarPedido;
const atualizarStatusPedido = async (req, res) => {
    try {
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        if (!clienteLogado.admin) {
            res.status(403).json({ mensagem: "Acesso restrito a administradores." });
            return;
        }
        const id_pedido = Number(req.params.id);
        const { status, data_pagamento } = req.body;
        const statusValidos = [
            "pendente",
            "pago",
            "em_preparacao",
            "enviado",
            "entregue",
            "cancelado",
        ];
        if (!status || !statusValidos.includes(status)) {
            res.status(400).json({
                mensagem: `Status invalido. Use um dos seguintes: ${statusValidos.join(", ")}.`,
            });
            return;
        }
        const pedido = await Pedido_1.default.findByPk(id_pedido);
        if (!pedido) {
            res.status(404).json({ mensagem: "Pedido nao encontrado." });
            return;
        }
        const dadosAtualizados = { status };
        if (status === "pago" && !pedido.data_pagamento) {
            dadosAtualizados.data_pagamento = data_pagamento ? new Date(data_pagamento) : new Date();
        }
        await pedido.update(dadosAtualizados);
        res.status(200).json({ mensagem: "Status do pedido atualizado.", pedido });
    }
    catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar status." });
    }
};
exports.atualizarStatusPedido = atualizarStatusPedido;
const cancelarPedido = async (req, res) => {
    try {
        const id_pedido = Number(req.params.id);
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        const pedido = await Pedido_1.default.findByPk(id_pedido);
        if (!pedido) {
            res.status(404).json({ mensagem: "Pedido nao encontrado." });
            return;
        }
        if (!clienteLogado.admin && pedido.id_cliente !== clienteLogado.id_cliente) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para cancelar este pedido." });
            return;
        }
        const statusNaoCancelaveis = ["enviado", "entregue", "cancelado"];
        if (statusNaoCancelaveis.includes(pedido.status ?? "")) {
            res.status(409).json({
                mensagem: `Pedido com status "${pedido.status}" nao pode ser cancelado.`,
            });
            return;
        }
        await pedido.update({ status: "cancelado" });
        res.status(200).json({ mensagem: "Pedido cancelado com sucesso." });
    }
    catch (error) {
        console.error("Erro ao cancelar pedido:", error);
        res.status(500).json({ mensagem: "Erro interno ao cancelar pedido." });
    }
};
exports.cancelarPedido = cancelarPedido;
//# sourceMappingURL=pedido.controller.js.map