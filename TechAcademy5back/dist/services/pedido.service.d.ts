import Pedido from "../models/Pedido";
export declare class HttpError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
interface PedidoItemInput {
    id_produto: number;
    quantidade: number;
}
interface CriarPedidoComItensInput {
    id_cliente: number;
    id_endereco_entrega: number;
    metodo?: string | null;
    itens: PedidoItemInput[];
}
export declare function carregarPedidoDetalhado(idPedido: number): Promise<Pedido | null>;
export declare function carregarPedidoDetalhadoDoCliente(idPedido: number, idCliente: number, isAdmin?: boolean): Promise<Pedido>;
export declare function criarPedidoComItens(input: CriarPedidoComItensInput, allowAdmin?: boolean): Promise<Pedido>;
export {};
//# sourceMappingURL=pedido.service.d.ts.map