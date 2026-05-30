"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const cliente_controller_1 = require("../controllers/cliente.controller");
jest.mock("../models/Cliente");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
beforeAll(() => {
    process.env.JWT_SECRET = "segredo_teste";
});
beforeEach(() => {
    jest.clearAllMocks();
    jsonwebtoken_1.default.sign.mockReturnValue("token_fake");
    jsonwebtoken_1.default.verify.mockReturnValue({
        id_cliente: 1,
        email: "joao@email.com",
        admin: false,
    });
});
const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
});
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe("cliente.controller", () => {
    it("1. Login com sucesso retorna token", async () => {
        const clienteMock = {
            id_cliente: 1,
            email: "joao@email.com",
            senha: "hashSenha",
            admin: false,
            toJSON: () => ({
                id_cliente: 1,
                email: "joao@email.com",
                senha: "hashSenha",
            }),
        };
        Cliente_1.default.findOne.mockResolvedValue(clienteMock);
        bcrypt_1.default.compare.mockResolvedValue(true);
        const req = mockRequest({
            email: "joao@email.com",
            senha: "Senha123",
        });
        const res = mockResponse();
        await (0, cliente_controller_1.loginCliente)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "token_fake" }));
    });
    it("2. Rota protegida com token valido chama next()", () => {
        const { authMiddleware } = require("../config/auth.middleware");
        const req = {
            headers: { authorization: "Bearer token_fake" },
        };
        const res = mockResponse();
        const next = jest.fn();
        authMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("3. Bloqueia acesso ao perfil de outro cliente", () => {
        const { selfOrAdminMiddleware } = require("../config/auth.middleware");
        const req = {
            cliente: {
                id_cliente: 1,
                email: "joao@email.com",
                admin: false,
            },
            params: { id: "2" },
        };
        const res = mockResponse();
        const next = jest.fn();
        selfOrAdminMiddleware()(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    it("4. Nao permite cadastro sem campos obrigatorios", async () => {
        const req = mockRequest({ nome: "Joao" });
        const res = mockResponse();
        await (0, cliente_controller_1.criarCliente)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Nome, email, senha e CPF sao obrigatorios.",
        });
    });
    it("5. Nao permite email invalido", async () => {
        const req = mockRequest({
            nome: "Joao",
            email: "email-invalido",
            senha: "Senha123",
            cpf: "12345678901",
        });
        const res = mockResponse();
        await (0, cliente_controller_1.criarCliente)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "E-mail invalido.",
        });
    });
    it("6. Senha e armazenada criptografada", async () => {
        Cliente_1.default.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);
        bcrypt_1.default.hash.mockResolvedValue("senhaHash");
        const novoCliente = {
            toJSON: () => ({
                id_cliente: 1,
                nome: "Joao",
                email: "joao@email.com",
                senha: "senhaHash",
            }),
        };
        Cliente_1.default.create.mockResolvedValue(novoCliente);
        const req = mockRequest({
            nome: "Joao",
            email: "joao@email.com",
            senha: "Senha123",
            cpf: "123.456.789-01",
        });
        const res = mockResponse();
        await (0, cliente_controller_1.criarCliente)(req, res);
        expect(bcrypt_1.default.hash).toHaveBeenCalledWith("Senha123", 10);
        expect(Cliente_1.default.create).toHaveBeenCalledWith(expect.objectContaining({ cpf: "12345678901" }));
    });
    it("7. Retorna 404 quando cliente nao existe", async () => {
        Cliente_1.default.findOne.mockResolvedValue(null);
        const req = mockRequest({}, { id: "999" });
        const res = mockResponse();
        await (0, cliente_controller_1.buscarClientePorId)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it("8. Lista clientes com paginacao", async () => {
        Cliente_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_cliente: 1, nome: "Joao" }],
            count: 1,
        });
        const req = mockRequest({}, {}, { page: "1", limit: "10" });
        const res = mockResponse();
        await (0, cliente_controller_1.listarClientes)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            dados: [{ id_cliente: 1, nome: "Joao" }],
            paginacao: {
                paginaAtual: 1,
                porPagina: 10,
                totalItens: 1,
                totalPaginas: 1,
            },
        });
    });
});
//# sourceMappingURL=cliente.test.js.map