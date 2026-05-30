"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("../models/Itempedido", () => ({
    __esModule: true,
    default: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock("../models/Pedido", () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    },
}));
jest.mock("../models/Produto", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    },
}));
jest.mock("../config/database", () => ({
    __esModule: true,
    default: {
        transaction: jest.fn().mockResolvedValue({
            commit: jest.fn(),
            rollback: jest.fn(),
        }),
    },
}));
const Itempedido_1 = __importDefault(require("../models/Itempedido"));
const Pedido_1 = __importDefault(require("../models/Pedido"));
const Produto_1 = __importDefault(require("../models/Produto"));
const database_1 = __importDefault(require("../config/database"));
const itempedido_controller_1 = require("../controllers/itempedido.controller");
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
describe("itempedido.controller", () => {
    it("1. lista itens do pedido com paginacao para o dono", async () => {
        Pedido_1.default.findByPk.mockResolvedValue({ id_pedido: 1, id_cliente: 1 });
        Itempedido_1.default.findAndCountAll.mockResolvedValue({
            rows: [{ id_item: 1, quantidade: 2 }],
            count: 1,
        });
        const req = mockRequest({}, { id_pedido: "1" }, { page: "1", limit: "10" }, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, itempedido_controller_1.listarItensDoPedido)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("2. bloqueia listagem de itens de pedido de outro cliente", async () => {
        Pedido_1.default.findByPk.mockResolvedValue({ id_pedido: 1, id_cliente: 2 });
        const req = mockRequest({}, { id_pedido: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, itempedido_controller_1.listarItensDoPedido)(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("3. busca item por id quando o pedido pertence ao cliente", async () => {
        Itempedido_1.default.findByPk.mockResolvedValue({ id_item: 1, id_pedido: 1 });
        Pedido_1.default.findByPk.mockResolvedValue({ id_pedido: 1, id_cliente: 1 });
        const req = mockRequest({}, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, itempedido_controller_1.buscarItemPorId)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("4. adiciona item com sucesso", async () => {
        const transactionMock = { commit: jest.fn(), rollback: jest.fn() };
        database_1.default.transaction.mockResolvedValue(transactionMock);
        Pedido_1.default.findByPk.mockResolvedValue({
            id_pedido: 1,
            id_cliente: 1,
            status: "pendente",
            update: jest.fn().mockResolvedValue(true),
        });
        Produto_1.default.findOne.mockResolvedValue({ id_produto: 1 });
        Itempedido_1.default.findOne.mockResolvedValue(null);
        Itempedido_1.default.create.mockResolvedValue({ id_item: 1, id_pedido: 1 });
        Itempedido_1.default.findAll.mockResolvedValue([{ quantidade: 2, preco_unitario: 100 }]);
        const req = mockRequest({ id_produto: 1, quantidade: 2, preco_unitario: 100 }, { id_pedido: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, itempedido_controller_1.adicionarItem)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(transactionMock.commit).toHaveBeenCalled();
    });
    it("5. atualiza quantidade do item", async () => {
        const transactionMock = { commit: jest.fn(), rollback: jest.fn() };
        database_1.default.transaction.mockResolvedValue(transactionMock);
        const itemMock = {
            id_pedido: 1,
            update: jest.fn().mockResolvedValue(true),
        };
        const pedidoMock = {
            id_cliente: 1,
            status: "pendente",
            update: jest.fn().mockResolvedValue(true),
        };
        Itempedido_1.default.findByPk.mockResolvedValue(itemMock);
        Pedido_1.default.findByPk.mockResolvedValue(pedidoMock);
        Itempedido_1.default.findAll.mockResolvedValue([{ quantidade: 3, preco_unitario: 100 }]);
        const req = mockRequest({ quantidade: 3 }, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, itempedido_controller_1.atualizarQuantidadeItem)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("6. remove item com sucesso", async () => {
        const transactionMock = { commit: jest.fn(), rollback: jest.fn() };
        database_1.default.transaction.mockResolvedValue(transactionMock);
        const itemMock = {
            id_pedido: 1,
            destroy: jest.fn().mockResolvedValue(true),
        };
        const pedidoMock = {
            id_cliente: 1,
            status: "pendente",
            update: jest.fn().mockResolvedValue(true),
        };
        Itempedido_1.default.findByPk.mockResolvedValue(itemMock);
        Pedido_1.default.findByPk.mockResolvedValue(pedidoMock);
        Itempedido_1.default.findAll.mockResolvedValue([]);
        const req = mockRequest({}, { id: "1" }, {}, { id_cliente: 1, admin: false, email: "teste@teste.com" });
        const res = mockResponse();
        await (0, itempedido_controller_1.removerItem)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
//# sourceMappingURL=itempedido.test.js.map