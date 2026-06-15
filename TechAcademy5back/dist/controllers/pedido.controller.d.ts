import { Request, Response } from "express";
export declare const listarPedidos: (req: Request, res: Response) => Promise<void>;
export declare const listarPedidosPorCliente: (req: Request, res: Response) => Promise<void>;
export declare const buscarPedidoPorId: (req: Request, res: Response) => Promise<void>;
export declare const criarPedido: (req: Request, res: Response) => Promise<void>;
export declare const atualizarStatusPedido: (req: Request, res: Response) => Promise<void>;
export declare const cancelarPedido: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=pedido.controller.d.ts.map