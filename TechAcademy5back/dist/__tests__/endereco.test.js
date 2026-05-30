"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("../models/Endereco", () => ({
    __esModule: true,
    default: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock("../models/Cliente", () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    },
}));
const Endereco_1 = __importDefault(require("../models/Endereco"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const endereco_controller_1 = require("../controllers/endereco.controller");
const mockRequest = (body = {}, params = {}, query = {}, cliente = undefined) => ({ body, params, query, cliente });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => {
    jest.restoreAllMocks();
});
describe("endereco.controller", () => {
    it("1. lista enderecos com paginacao", async () => {
        Endereco_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_endereco: 1, cidade: "Sao Paulo" }],
            count: 1,
        });
        const req = mockRequest({}, {}, { page: "1", limit: "10" });
        const res = mockResponse();
        await (0, endereco_controller_1.listarEnderecos)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("2. lista enderecos por cliente com paginacao", async () => {
        Endereco_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_endereco: 1, id_cliente: 1 }],
            count: 1,
        });
        const req = mockRequest({}, { id_cliente: "1" }, { page: "1", limit: "10" });
        const res = mockResponse();
        await (0, endereco_controller_1.listarEnderecosPorCliente)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("3. busca endereco por id quando pertence ao cliente logado", async () => {
        Endereco_1.default.findByPk.mockResolvedValue({ id_endereco: 1, id_cliente: 1 });
        const req = mockRequest({}, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, endereco_controller_1.buscarEnderecoPorId)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("4. bloqueia busca de endereco de outro cliente para usuario comum", async () => {
        Endereco_1.default.findByPk.mockResolvedValue({ id_endereco: 1, id_cliente: 2 });
        const req = mockRequest({}, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, endereco_controller_1.buscarEnderecoPorId)(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("5. cria endereco com sucesso para o proprio cliente", async () => {
        Cliente_1.default.findByPk.mockResolvedValue({ id_cliente: 1 });
        Endereco_1.default.create.mockResolvedValue({ id_endereco: 1 });
        const req = mockRequest({ cidade: "Sao Paulo" }, {}, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, endereco_controller_1.criarEndereco)(req, res);
        expect(Endereco_1.default.create).toHaveBeenCalledWith(expect.objectContaining({ id_cliente: 1 }));
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it("6. atualiza endereco existente do proprio cliente", async () => {
        const enderecoMock = { id_cliente: 1, update: jest.fn().mockResolvedValue(true) };
        Endereco_1.default.findByPk.mockResolvedValue(enderecoMock);
        const req = mockRequest({ cidade: "Campinas" }, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, endereco_controller_1.atualizarEndereco)(req, res);
        expect(enderecoMock.update).toHaveBeenCalled();
    });
    it("7. deleta endereco existente do proprio cliente", async () => {
        const enderecoMock = { id_cliente: 1, destroy: jest.fn().mockResolvedValue(true) };
        Endereco_1.default.findByPk.mockResolvedValue(enderecoMock);
        const req = mockRequest({}, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, endereco_controller_1.deletarEndereco)(req, res);
        expect(enderecoMock.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
//# sourceMappingURL=endereco.test.js.map