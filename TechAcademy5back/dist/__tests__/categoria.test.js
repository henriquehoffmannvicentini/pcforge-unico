"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Categoria_1 = __importDefault(require("../models/Categoria"));
const categoria_controller_1 = require("../controllers/categoria.controller");
jest.mock("../models/Categoria");
const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
beforeEach(() => {
    jest.clearAllMocks();
});
describe("categoria.controller", () => {
    it("1. cria categoria com sucesso", async () => {
        Categoria_1.default.create.mockResolvedValue({ id_categoria: 1, nome: "Placa de video" });
        const req = mockRequest({ nome: "Placa de video" });
        const res = mockResponse();
        await (0, categoria_controller_1.criarCategoria)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it("2. lista categorias com paginacao", async () => {
        Categoria_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_categoria: 1, nome: "Placa de video" }],
            count: 1,
        });
        const req = mockRequest();
        const res = mockResponse();
        await (0, categoria_controller_1.listarCategorias)(req, res);
        expect(res.json).toHaveBeenCalledWith([{ id_categoria: 1, nome: "Placa de video" }]);
    });
    it("3. busca categoria por id", async () => {
        Categoria_1.default.findByPk.mockResolvedValue({ id_categoria: 1, nome: "Placa de video" });
        const req = mockRequest({}, { id: "1" });
        const res = mockResponse();
        await (0, categoria_controller_1.buscarCategoria)(req, res);
        expect(res.json).toHaveBeenCalled();
    });
    it("4. atualiza categoria existente", async () => {
        const categoriaMock = { update: jest.fn().mockResolvedValue(true) };
        Categoria_1.default.findByPk.mockResolvedValue(categoriaMock);
        const req = mockRequest({ nome: "SSD" }, { id: "1" });
        const res = mockResponse();
        await (0, categoria_controller_1.atualizarCategoria)(req, res);
        expect(categoriaMock.update).toHaveBeenCalledWith({ nome: "SSD" });
    });
    it("5. deleta categoria existente", async () => {
        const categoriaMock = { destroy: jest.fn().mockResolvedValue(true) };
        Categoria_1.default.findByPk.mockResolvedValue(categoriaMock);
        const req = mockRequest({}, { id: "1" });
        const res = mockResponse();
        await (0, categoria_controller_1.deletarCategoria)(req, res);
        expect(categoriaMock.destroy).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ mensagem: "Categoria deletada com sucesso" });
    });
});
//# sourceMappingURL=categoria.test.js.map