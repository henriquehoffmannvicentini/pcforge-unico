"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarCategoria = exports.atualizarCategoria = exports.buscarCategoria = exports.listarCategorias = exports.criarCategoria = void 0;
const Categoria_1 = __importDefault(require("../models/Categoria"));
const pagination_1 = require("../utils/pagination");
const criarCategoria = async (req, res) => {
    try {
        const { nome, descricao, ativo } = req.body;
        const categoria = await Categoria_1.default.create({
            nome,
            descricao,
            ativo
        });
        return res.status(201).json(categoria);
    }
    catch (error) {
        return res.status(500).json({ erro: "Erro ao criar categoria" });
    }
};
exports.criarCategoria = criarCategoria;
const listarCategorias = async (_req, res) => {
    try {
        const req = _req;
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const queryOptions = {
            order: [["id_categoria", "ASC"]],
        };
        if (shouldPaginate) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }
        const { rows: categorias, count } = await Categoria_1.default.findAndCountAll(queryOptions);
        return res.json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(categorias, count, page, limit) : categorias);
    }
    catch (error) {
        return res.status(500).json({ erro: "Erro ao listar categorias" });
    }
};
exports.listarCategorias = listarCategorias;
const buscarCategoria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const categoria = await Categoria_1.default.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        return res.json(categoria);
    }
    catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar categoria" });
    }
};
exports.buscarCategoria = buscarCategoria;
const atualizarCategoria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const categoria = await Categoria_1.default.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        await categoria.update(req.body);
        return res.json(categoria);
    }
    catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar categoria" });
    }
};
exports.atualizarCategoria = atualizarCategoria;
const deletarCategoria = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const categoria = await Categoria_1.default.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ erro: "Categoria não encontrada" });
        }
        await categoria.destroy();
        return res.json({ mensagem: "Categoria deletada com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ erro: "Erro ao deletar categoria" });
    }
};
exports.deletarCategoria = deletarCategoria;
//# sourceMappingURL=categoria.controller.js.map