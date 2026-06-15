"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCliente = exports.desativarCliente = exports.atualizarCliente = exports.criarCliente = exports.buscarClientePorId = exports.listarClientes = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const jwt_1 = require("../config/jwt");
const pagination_1 = require("../utils/pagination");
const cliente_validation_1 = require("../utils/cliente.validation");
const listarClientes = async (req, res) => {
    try {
        const { page, limit, offset } = (0, pagination_1.getPaginationParams)(req);
        const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
        const incluirInativos = req.query.incluir_inativos === "true" || req.query.all === "true";
        const queryOptions = {
            attributes: { exclude: ["senha"] },
            where: incluirInativos ? {} : { ativo: true },
            order: [["id_cliente", "ASC"]],
        };
        if (shouldPaginate) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }
        const { rows: clientes, count } = await Cliente_1.default.findAndCountAll(queryOptions);
        res.status(200).json(shouldPaginate ? (0, pagination_1.buildPaginatedResponse)(clientes, count, page, limit) : clientes);
    }
    catch (error) {
        console.error("Erro ao listar clientes:", error);
        res.status(500).json({ mensagem: "Erro interno ao listar clientes." });
    }
};
exports.listarClientes = listarClientes;
const buscarClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente_1.default.findOne({
            where: { id_cliente: id, ativo: true },
            attributes: { exclude: ["senha"] },
        });
        if (!cliente) {
            res.status(404).json({ mensagem: "Cliente nao encontrado." });
            return;
        }
        res.status(200).json(cliente);
    }
    catch (error) {
        console.error("Erro ao buscar cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao buscar cliente." });
    }
};
exports.buscarClientePorId = buscarClientePorId;
const criarCliente = async (req, res) => {
    try {
        const { nome, email, senha, telefone, cpf, admin } = req.body;
        const clienteLogado = req.cliente;
        if (!nome || !email || !senha || !cpf) {
            res.status(400).json({ mensagem: "Nome, email, senha e CPF sao obrigatorios." });
            return;
        }
        if (!(0, cliente_validation_1.isValidEmail)(email)) {
            res.status(400).json({ mensagem: "E-mail invalido." });
            return;
        }
        if (!(0, cliente_validation_1.isValidCpf)(cpf)) {
            res.status(400).json({ mensagem: "CPF invalido." });
            return;
        }
        if (!(0, cliente_validation_1.isStrongPassword)(senha)) {
            res.status(400).json({
                mensagem: "A senha deve ter no minimo 8 caracteres, incluindo letra maiuscula, minuscula e numero.",
            });
            return;
        }
        const clienteExistente = await Cliente_1.default.findOne({ where: { email } });
        if (clienteExistente) {
            res.status(409).json({ mensagem: "E-mail ja cadastrado." });
            return;
        }
        const cpfSanitizado = (0, cliente_validation_1.sanitizeCpf)(cpf);
        const cpfEmUso = await Cliente_1.default.findOne({ where: { cpf: cpfSanitizado } });
        if (cpfEmUso) {
            res.status(409).json({ mensagem: "CPF ja cadastrado." });
            return;
        }
        const senhaCriptografada = await bcrypt_1.default.hash(senha, 10);
        const isAdmin = clienteLogado?.admin === true && admin === true;
        const novoCliente = await Cliente_1.default.create({
            nome,
            email,
            senha: senhaCriptografada,
            telefone: telefone || null,
            cpf: cpfSanitizado,
            ativo: true,
            admin: isAdmin,
        });
        const { senha: _senha, ...clienteSemSenha } = novoCliente.toJSON();
        res.status(201).json({ mensagem: "Cliente criado com sucesso.", cliente: clienteSemSenha });
    }
    catch (error) {
        console.error("Erro ao criar cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao criar cliente." });
    }
};
exports.criarCliente = criarCliente;
const atualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, cpf, senha, admin, ativo } = req.body;
        const clienteLogado = req.cliente;
        if (!clienteLogado) {
            res.status(401).json({ mensagem: "Usuario nao autenticado." });
            return;
        }
        if (clienteLogado.id_cliente !== Number(id) && !clienteLogado.admin) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para editar este cliente." });
            return;
        }
        const whereClause = clienteLogado.admin
            ? { id_cliente: id }
            : { id_cliente: id, ativo: true };
        const cliente = await Cliente_1.default.findOne({ where: whereClause });
        if (!cliente) {
            res.status(404).json({ mensagem: "Cliente nao encontrado." });
            return;
        }
        if (!nome || !telefone || !cpf) {
            res.status(400).json({
                mensagem: "Nome, telefone e CPF sao obrigatorios para editar o perfil.",
            });
            return;
        }
        if (email && email !== cliente.email) {
            res.status(400).json({ mensagem: "Nao e permitido alterar o e-mail." });
            return;
        }
        if (cpf && cpf !== cliente.cpf) {
            if (!(0, cliente_validation_1.isValidCpf)(cpf)) {
                res.status(400).json({ mensagem: "CPF invalido." });
                return;
            }
            const cpfSanitizado = (0, cliente_validation_1.sanitizeCpf)(cpf);
            const cpfEmUso = await Cliente_1.default.findOne({
                where: { cpf: cpfSanitizado, id_cliente: { [sequelize_1.Op.ne]: Number(id) } },
            });
            if (cpfEmUso) {
                res.status(409).json({ mensagem: "CPF ja esta em uso por outro cliente." });
                return;
            }
        }
        const dadosAtualizados = {};
        if (nome)
            dadosAtualizados.nome = nome;
        if (telefone !== undefined)
            dadosAtualizados.telefone = telefone;
        if (cpf)
            dadosAtualizados.cpf = (0, cliente_validation_1.sanitizeCpf)(cpf);
        if (senha) {
            if (!(0, cliente_validation_1.isStrongPassword)(senha)) {
                res.status(400).json({
                    mensagem: "A senha deve ter no minimo 8 caracteres, incluindo letra maiuscula, minuscula e numero.",
                });
                return;
            }
            dadosAtualizados.senha = await bcrypt_1.default.hash(senha, 10);
        }
        if (clienteLogado.admin) {
            if (admin !== undefined)
                dadosAtualizados.admin = Boolean(admin);
            if (ativo !== undefined)
                dadosAtualizados.ativo = Boolean(ativo);
        }
        await cliente.update(dadosAtualizados);
        const { senha: _senha, ...clienteSemSenha } = cliente.toJSON();
        res.status(200).json({ mensagem: "Cliente atualizado com sucesso.", cliente: clienteSemSenha });
    }
    catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao atualizar cliente." });
    }
};
exports.atualizarCliente = atualizarCliente;
const desativarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const clienteLogado = req.cliente;
        if (!clienteLogado) {
            res.status(401).json({ mensagem: "Usuario nao autenticado." });
            return;
        }
        if (clienteLogado.id_cliente !== Number(id) && !clienteLogado.admin) {
            res.status(403).json({ mensagem: "Voce nao tem permissao para desativar este cliente." });
            return;
        }
        const cliente = await Cliente_1.default.findOne({ where: { id_cliente: id, ativo: true } });
        if (!cliente) {
            res.status(404).json({ mensagem: "Cliente nao encontrado ou ja inativo." });
            return;
        }
        await cliente.update({ ativo: false });
        res.status(200).json({ mensagem: "Cliente desativado com sucesso." });
    }
    catch (error) {
        console.error("Erro ao desativar cliente:", error);
        res.status(500).json({ mensagem: "Erro interno ao desativar cliente." });
    }
};
exports.desativarCliente = desativarCliente;
const loginCliente = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.status(400).json({ mensagem: "E-mail e senha sao obrigatorios." });
            return;
        }
        const cliente = await Cliente_1.default.findOne({ where: { email, ativo: true } });
        if (!cliente) {
            res.status(401).json({ mensagem: "Credenciais invalidas." });
            return;
        }
        const senhaCorreta = await bcrypt_1.default.compare(senha, cliente.senha);
        if (!senhaCorreta) {
            res.status(401).json({ mensagem: "Credenciais invalidas." });
            return;
        }
        const { senha: _senha, ...clienteSemSenha } = cliente.toJSON();
        const token = jsonwebtoken_1.default.sign({ id_cliente: cliente.id_cliente, email: cliente.email, admin: cliente.admin }, (0, jwt_1.getJwtSecret)(), { expiresIn: "1d" });
        res.status(200).json({ mensagem: "Login realizado com sucesso.", token, cliente: clienteSemSenha });
    }
    catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ mensagem: "Erro interno no login." });
    }
};
exports.loginCliente = loginCliente;
//# sourceMappingURL=cliente.controller.js.map