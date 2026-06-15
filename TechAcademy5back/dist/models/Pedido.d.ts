import { Model, Optional } from "sequelize";
interface PedidoAttributes {
    id_pedido: number;
    id_cliente: number;
    id_endereco_entrega: number;
    data_pedido?: Date;
    metodo?: string | null;
    valor?: number | null;
    status?: string | null;
    data_pagamento?: Date | null;
}
interface PedidoCreationAttributes extends Optional<PedidoAttributes, "id_pedido"> {
}
declare class Pedido extends Model<PedidoAttributes, PedidoCreationAttributes> implements PedidoAttributes {
    id_pedido: number;
    id_cliente: number;
    id_endereco_entrega: number;
    data_pedido: Date;
    metodo: string | null;
    valor: number | null;
    status: string | null;
    data_pagamento: Date | null;
}
export default Pedido;
//# sourceMappingURL=Pedido.d.ts.map