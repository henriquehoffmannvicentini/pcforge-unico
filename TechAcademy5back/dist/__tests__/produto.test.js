"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Produto_1 = __importDefault(require("../models/Produto"));
const produto_controller_1 = require("../controllers/produto.controller");
jest.mock("../models/Produto");
let consoleErrorSpy;
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
beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => {
    consoleErrorSpy.mockRestore();
});
describe("listarProdutos", () => {
    it("1. Retorna lista de produtos ativos com status 200", async () => {
        Produto_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_produto: 1, nome: "RTX 4070", ativo: true }],
            count: 1,
        });
        const req = mockRequest();
        const res = mockResponse();
        await (0, produto_controller_1.listarProdutos)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id_produto: 1, nome: "RTX 4070", ativo: true }]);
    });
    it("2. Retorna 500 em caso de erro", async () => {
        Produto_1.default.findAndCountAll.mockRejectedValue(new Error("Erro no banco"));
        const req = mockRequest();
        const res = mockResponse();
        await (0, produto_controller_1.listarProdutos)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Erro interno ao listar produtos.",
        });
    });
});
describe("buscarProdutoPorId", () => {
    it("3. Retorna produto com status 200", async () => {
        Produto_1.default.findOne.mockResolvedValue({
            id_produto: 1,
            nome: "RTX 4070",
            ativo: true,
        });
        const req = mockRequest({}, { id: "1" });
        const res = mockResponse();
        await (0, produto_controller_1.buscarProdutoPorId)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("4. Retorna 404 se produto nao encontrado", async () => {
        Produto_1.default.findOne.mockResolvedValue(null);
        const req = mockRequest({}, { id: "999" });
        const res = mockResponse();
        await (0, produto_controller_1.buscarProdutoPorId)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
describe("criarProduto", () => {
    it("5. Cria produto com sucesso e retorna 201", async () => {
        Produto_1.default.create.mockResolvedValue({
            id_produto: 1,
            nome: "RTX 4070",
            valor: 3899,
        });
        const req = mockRequest({ nome: "RTX 4070", valor: 3899 });
        const res = mockResponse();
        await (0, produto_controller_1.criarProduto)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it("6. Retorna 400 se faltar nome ou valor", async () => {
        const req = mockRequest({ nome: "RTX 4070" });
        const res = mockResponse();
        await (0, produto_controller_1.criarProduto)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
describe("atualizarProduto", () => {
    it("7. Atualiza produto com sucesso e retorna 200", async () => {
        const produtoMock = {
            id_produto: 1,
            update: jest.fn().mockResolvedValue(true),
        };
        Produto_1.default.findOne.mockResolvedValue(produtoMock);
        const req = mockRequest({ nome: "RTX 4070 Super" }, { id: "1" });
        const res = mockResponse();
        await (0, produto_controller_1.atualizarProduto)(req, res);
        expect(produtoMock.update).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
describe("desativarProduto", () => {
    it("8. Desativa produto e retorna 200", async () => {
        const produtoMock = {
            update: jest.fn().mockResolvedValue(true),
        };
        Produto_1.default.findOne.mockResolvedValue(produtoMock);
        const req = mockRequest({}, { id: "1" });
        const res = mockResponse();
        await (0, produto_controller_1.desativarProduto)(req, res);
        expect(produtoMock.update).toHaveBeenCalledWith({ ativo: false });
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
describe("buscarProdutosPorNome", () => {
    it("9. Retorna produtos encontrados com status 200", async () => {
        Produto_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_produto: 1, nome: "RTX 4070" }],
            count: 1,
        });
        const req = mockRequest({}, {}, { nome: "RTX" });
        const res = mockResponse();
        await (0, produto_controller_1.buscarProdutosPorNome)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id_produto: 1, nome: "RTX 4070" }]);
    });
});
//# sourceMappingURL=produto.test.js.map