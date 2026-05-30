import Pedido from "../models/Pedido";
type PedidoComRelacionamentos = Pedido & {
    cliente?: {
        nome?: string | null;
        email?: string | null;
    };
    itens?: Array<{
        quantidade: number;
        preco_unitario: number;
        produto?: {
            nome?: string | null;
            imagem?: string | null;
        };
    }>;
};
export declare function criarPreferenciaMercadoPago(pedido: PedidoComRelacionamentos, frontendUrl?: string): Promise<unknown>;
export declare function buscarPagamentoMercadoPago(paymentId: number): Promise<unknown>;
export {};
//# sourceMappingURL=mercadoPago.service.d.ts.map