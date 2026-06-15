"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarEndereco = exports.atualizarEndereco = exports.criarEndereco = exports.buscarEnderecoPorId = exports.listarEnderecosPorCliente = exports.listarEnderecos = void 0;
const Endereco_1 = __importDefault(require("../models/Endereco"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const pagination_1 = require("../utils/pagination");
const getClienteAutenticado = (req, res) => {
    if (!req.cliente) {
        res.status(401).json({ mensagem: "Usuario nao autenticado." });
        return null;
    }
    return req.cliente;
};
const listarEnderecos = async (req, res) => {
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
            ],
            distinct: true,
            order: [["id_endereco", "DESC"]],
        };
        const { rows: enderecos, count } = shouldPaginate
            ? await Endereco_1.default.findAndCountAll({
                ...baseOptions,
                limit,
                offset,
            })
            : await Endereco_1.default.findAndCountAll(baseOptions);
        res
            .status(200)
            .json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(enderecos, count, page, limit) : enderecos);
    }
    catch (error) {
        console.error("Erro ao listar enderecos:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar enderecos." });
    }
};
exports.listarEnderecos = listarEnderecos;
const listarEnderecosPorCliente = async (req, res) => {
    try {
        const id_cliente = Number(req.params.id_cliente);
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const baseOptions = {
            where: { id_cliente },
            order: [["id_endereco", "DESC"]],
        };
        const { rows: enderecos, count } = shouldPaginate
            ? await Endereco_1.default.findAndCountAll({
                ...baseOptions,
                limit,
                offset,
            })
            : await Endereco_1.default.findAndCountAll(baseOptions);
        res
            .status(200)
            .json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(enderecos, count, page, limit) : enderecos);
    }
    catch (error) {
        console.error("Erro ao listar enderecos do cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar enderecos do cliente." });
    }
};
exports.listarEnderecosPorCliente = listarEnderecosPorCliente;
const buscarEnderecoPorId = async (req, res) => {
    try {
        const id_endereco = Number(req.params.id);
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        const endereco = await Endereco_1.default.findByPk(id_endereco, {
            include: [
                {
                    model: Cliente_1.default,
                    as: "cliente",
                    attributes: ["id_cliente", "nome", "email"],
                },
            ],
        });
        if (!endereco) {
            res.status(404).json({ mensagem: "Endereco nao encontrado." });
            return;
        }
        if (!clienteLogado.admin && endereco.id_cliente !== clienteLogado.id_cliente) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para acessar este endereco." });
            return;
        }
        res.status(200).json(endereco);
    }
    catch (error) {
        console.error("Erro ao buscar endereco:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar endereco." });
    }
};
exports.buscarEnderecoPorId = buscarEnderecoPorId;
const criarEndereco = async (req, res) => {
    try {
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        const { id_cliente, numero, complemento, bairro, cidade, estado, cep } = req.body;
        const idClienteBody = id_cliente !== undefined ? Number(id_cliente) : undefined;
        const idCliente = clienteLogado.admin ? idClienteBody : clienteLogado.id_cliente;
        if (!idCliente) {
            res.status(400).json({ mensagem: "O id_cliente e obrigatorio." });
            return;
        }
        if (!clienteLogado.admin && idClienteBody !== undefined && idClienteBody !== clienteLogado.id_cliente) {
            res.status(403).json({ mensagem: "Voce nao pode criar endereco para outro cliente." });
            return;
        }
        const cliente = await Cliente_1.default.findByPk(idCliente);
        if (!cliente) {
            res.status(404).json({ mensagem: "Cliente nao encontrado." });
            return;
        }
        const novoEndereco = await Endereco_1.default.create({
            id_cliente: idCliente,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
        });
        res.status(201).json({
            mensagem: "Endereco criado com sucesso.",
            endereco: novoEndereco,
        });
    }
    catch (error) {
        console.error("Erro ao criar endereco:", error);
        res.status(500).json({ mensagem: "Erro interno ao criar endereco." });
    }
};
exports.criarEndereco = criarEndereco;
const atualizarEndereco = async (req, res) => {
    try {
        const id_endereco = Number(req.params.id);
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        const endereco = await Endereco_1.default.findByPk(id_endereco);
        if (!endereco) {
            res.status(404).json({ mensagem: "Endereco nao encontrado." });
            return;
        }
        if (!clienteLogado.admin && endereco.id_cliente !== clienteLogado.id_cliente) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para atualizar este endereco." });
            return;
        }
        const { numero, complemento, bairro, cidade, estado, cep } = req.body;
        await endereco.update({
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
        });
        res.status(200).json({
            mensagem: "Endereco atualizado com sucesso.",
            endereco,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar endereco:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar endereco." });
    }
};
exports.atualizarEndereco = atualizarEndereco;
const deletarEndereco = async (req, res) => {
    try {
        const id_endereco = Number(req.params.id);
        const clienteLogado = getClienteAutenticado(req, res);
        if (!clienteLogado) {
            return;
        }
        const endereco = await Endereco_1.default.findByPk(id_endereco);
        if (!endereco) {
            res.status(404).json({ mensagem: "Endereco nao encontrado." });
            return;
        }
        if (!clienteLogado.admin && endereco.id_cliente !== clienteLogado.id_cliente) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para deletar este endereco." });
            return;
        }
        await endereco.destroy();
        res.status(200).json({ mensagem: "Endereco deletado com sucesso." });
    }
    catch (error) {
        console.error("Erro ao deletar endereco:", error);
        res.status(500).json({ mensagem: "Erro interno ao deletar endereco." });
    }
};
exports.deletarEndereco = deletarEndereco;
//# sourceMappingURL=endereco.controller.js.map