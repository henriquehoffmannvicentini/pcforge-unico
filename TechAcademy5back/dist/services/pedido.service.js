"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.carregarPedidoDetalhado = carregarPedidoDetalhado;
exports.carregarPedidoDetalhadoDoCliente = carregarPedidoDetalhadoDoCliente;
exports.criarPedidoComItens = criarPedidoComItens;
const database_1 = __importDefault(require("../config/database"));
const Pedido_1 = __importDefault(require("../models/Pedido"));
const Itempedido_1 = __importDefault(require("../models/Itempedido"));
const Produto_1 = __importDefault(require("../models/Produto"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const Endereco_1 = __importDefault(require("../models/Endereco"));
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = "HttpError";
        this.statusCode = statusCode;
    }
}
exports.HttpError = HttpError;
function parsePositiveInteger(value, fieldName) {
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        throw new HttpError(400, `${fieldName} deve ser um inteiro maior que zero.`);
    }
    return parsedValue;
}
async function validarEnderecoDoCliente(idEnderecoEntrega, idCliente, allowAdmin = false) {
    const endereco = await Endereco_1.default.findByPk(idEnderecoEntrega);
    if (!endereco) {
        throw new HttpError(404, "Endereco de entrega nao encontrado.");
    }
    if (!allowAdmin && Number(endereco.id_cliente) !== Number(idCliente)) {
        throw new HttpError(403, "Este endereco nao pertence ao cliente autenticado.");
    }
    return endereco;
}
async function normalizarItensPedido(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
        throw new HttpError(400, "Informe pelo menos um item para criar o pedido.");
    }
    const quantidadePorProduto = new Map();
    itens.forEach((item, index) => {
        const idProduto = parsePositiveInteger(item?.id_produto, `id_produto do item ${index + 1}`);
        const quantidade = parsePositiveInteger(item?.quantidade, `quantidade do item ${index + 1}`);
        quantidadePorProduto.set(idProduto, (quantidadePorProduto.get(idProduto) || 0) + quantidade);
    });
    const idsProdutos = Array.from(quantidadePorProduto.keys());
    const produtos = await Produto_1.default.findAll({
        where: {
            id_produto: idsProdutos,
            ativo: true,
        },
    });
    const produtoPorId = new Map(produtos.map((produto) => [Number(produto.id_produto), produto]));
    if (produtos.length !== idsProdutos.length) {
        const idsInvalidos = idsProdutos.filter((idProduto) => !produtoPorId.has(idProduto));
        throw new HttpError(404, `Os seguintes produtos nao foram encontrados ou estao inativos: ${idsInvalidos.join(", ")}.`);
    }
    return idsProdutos.map((idProduto) => {
        const produto = produtoPorId.get(idProduto);
        const quantidade = quantidadePorProduto.get(idProduto);
        const estoqueAtual = Number(produto.estoque || 0);
        if (estoqueAtual < quantidade) {
            throw new HttpError(409, `Estoque insuficiente para o produto "${produto.nome}". Disponivel: ${estoqueAtual}.`);
        }
        return {
            id_produto: idProduto,
            quantidade,
            preco_unitario: Number(produto.valor),
            produto,
        };
    });
}
async function carregarPedidoDetalhado(idPedido) {
    return Pedido_1.default.findByPk(idPedido, {
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
                        attributes: ["id_produto", "nome", "valor", "imagem", "estoque"],
                    },
                ],
            },
        ],
    });
}
async function carregarPedidoDetalhadoDoCliente(idPedido, idCliente, isAdmin = false) {
    const pedido = await carregarPedidoDetalhado(idPedido);
    if (!pedido) {
        throw new HttpError(404, "Pedido nao encontrado.");
    }
    if (!isAdmin && Number(pedido.id_cliente) !== Number(idCliente)) {
        throw new HttpError(403, "Voce nao tem permissao para acessar este pedido.");
    }
    return pedido;
}
async function criarPedidoComItens(input, allowAdmin = false) {
    const idCliente = parsePositiveInteger(input.id_cliente, "id_cliente");
    const idEnderecoEntrega = parsePositiveInteger(input.id_endereco_entrega, "id_endereco_entrega");
    const itensNormalizados = await normalizarItensPedido(input.itens);
    await validarEnderecoDoCliente(idEnderecoEntrega, idCliente, allowAdmin);
    const valorTotal = itensNormalizados.reduce((accumulator, item) => accumulator + item.quantidade * item.preco_unitario, 0);
    const transaction = await database_1.default.transaction();
    try {
        const novoPedido = await Pedido_1.default.create({
            id_cliente: idCliente,
            id_endereco_entrega: idEnderecoEntrega,
            metodo: input.metodo || null,
            valor: Number(valorTotal.toFixed(2)),
            status: "pendente",
        }, { transaction });
        await Itempedido_1.default.bulkCreate(itensNormalizados.map((item) => ({
            id_pedido: novoPedido.id_pedido,
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
        })), { transaction });
        await transaction.commit();
        const pedidoCriado = await carregarPedidoDetalhado(novoPedido.id_pedido);
        if (!pedidoCriado) {
            throw new HttpError(500, "Nao foi possivel carregar o pedido criado.");
        }
        return pedidoCriado;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
//# sourceMappingURL=pedido.service.js.map