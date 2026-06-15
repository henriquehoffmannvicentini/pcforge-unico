"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProdutosDestaque = exports.buscarProdutosPorNome = exports.desativarProduto = exports.atualizarProduto = exports.criarProduto = exports.buscarProdutoPorId = exports.listarProdutos = void 0;
const Produto_1 = __importDefault(require("../models/Produto"));
const sequelize_1 = require("sequelize");
const pagination_1 = require("../utils/pagination");
const listarProdutos = async (req, res) => {
    try {
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const queryOptions = {
            where: { ativo: true },
            order: [["id_produto", "ASC"]],
        };
        if (shouldPaginate) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }
        const { rows: produtos, count } = await Produto_1.default.findAndCountAll(queryOptions);
        res.status(200).json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(produtos, count, page, limit) : produtos);
    }
    catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar produtos." });
    }
};
exports.listarProdutos = listarProdutos;
const buscarProdutoPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const produto = await Produto_1.default.findOne({
            where: { id_produto: id, ativo: true },
        });
        if (!produto) {
            res.status(404).json({ mensagem: "Produto não encontrado." });
            return;
        }
        res.status(200).json(produto);
    }
    catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar produto." });
    }
};
exports.buscarProdutoPorId = buscarProdutoPorId;
const criarProduto = async (req, res) => {
    try {
        const { nome, descricao, valor, id_categoria, imagem, destaque, estoque } = req.body;
        if (!nome || !valor) {
            res.status(400).json({ mensagem: "Nome e valor são obrigatórios." });
            return;
        }
        const novoProduto = await Produto_1.default.create({
            nome,
            descricao: descricao || null,
            valor,
            id_categoria: id_categoria || null,
            imagem: imagem || null,
            destaque: destaque || false,
            estoque: estoque || 0,
            ativo: true,
        });
        res.status(201).json({
            mensagem: "Produto criado com sucesso.",
            produto: novoProduto,
        });
    }
    catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ mensagem: "Erro interno ao criar produto." });
    }
};
exports.criarProduto = criarProduto;
const atualizarProduto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const produto = await Produto_1.default.findOne({
            where: { id_produto: id, ativo: true },
        });
        if (!produto) {
            res.status(404).json({ mensagem: "Produto não encontrado." });
            return;
        }
        const { nome, descricao, valor, id_categoria, imagem, destaque, estoque } = req.body;
        const dadosAtualizados = {};
        if (nome)
            dadosAtualizados.nome = nome;
        if (descricao !== undefined)
            dadosAtualizados.descricao = descricao;
        if (valor !== undefined)
            dadosAtualizados.valor = valor;
        if (id_categoria !== undefined)
            dadosAtualizados.id_categoria = id_categoria;
        if (imagem !== undefined)
            dadosAtualizados.imagem = imagem;
        if (destaque !== undefined)
            dadosAtualizados.destaque = destaque;
        if (estoque !== undefined)
            dadosAtualizados.estoque = estoque;
        await produto.update(dadosAtualizados);
        res.status(200).json({
            mensagem: "Produto atualizado com sucesso.",
            produto,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar produto." });
    }
};
exports.atualizarProduto = atualizarProduto;
const desativarProduto = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const produto = await Produto_1.default.findOne({
            where: { id_produto: id, ativo: true },
        });
        if (!produto) {
            res.status(404).json({
                mensagem: "Produto não encontrado ou já desativado.",
            });
            return;
        }
        await produto.update({ ativo: false });
        res.status(200).json({
            mensagem: "Produto desativado com sucesso.",
        });
    }
    catch (error) {
        console.error("Erro ao desativar produto:", error);
        res.status(500).json({
            mensagem: "Erro interno ao desativar produto.",
        });
    }
};
exports.desativarProduto = desativarProduto;
const buscarProdutosPorNome = async (req, res) => {
    try {
        const nome = req.query.nome;
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        if (!nome) {
            res.status(400).json({ mensagem: "Informe um nome para buscar." });
            return;
        }
        const queryOptions = {
            where: {
                nome: { [sequelize_1.Op.like]: `%${nome}%` },
                ativo: true,
            },
        };
        if (shouldPaginate) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }
        const { rows: produtos, count } = await Produto_1.default.findAndCountAll(queryOptions);
        res.status(200).json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(produtos, count, page, limit) : produtos);
    }
    catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar produtos." });
    }
};
exports.buscarProdutosPorNome = buscarProdutosPorNome;
const listarProdutosDestaque = async (req, res) => {
    try {
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const queryOptions = {
            where: { destaque: true, ativo: true },
        };
        if (shouldPaginate) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }
        const { rows: produtos, count } = await Produto_1.default.findAndCountAll(queryOptions);
        res.status(200).json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(produtos, count, page, limit) : produtos);
    }
    catch (error) {
        console.error("Erro ao listar produtos destaque:", error);
        res.status(500).json({
            mensagem: "Erro interno ao listar produtos destaque.",
        });
    }
};
exports.listarProdutosDestaque = listarProdutosDestaque;
//# sourceMappingURL=produto.controller.js.map