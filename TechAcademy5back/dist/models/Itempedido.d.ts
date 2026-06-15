import { Model, Optional } from "sequelize";
interface ItemPedidoAttributes {
    id_item: number;
    id_pedido: number;
    id_produto: number;
    quantidade: number;
    preco_unitario: number;
}
interface ItemPedidoCreationAttributes extends Optional<ItemPedidoAttributes, "id_item"> {
}
declare class ItemPedido extends Model<ItemPedidoAttributes, ItemPedidoCreationAttributes> implements ItemPedidoAttributes {
    id_item: number;
    id_pedido: number;
    id_produto: number;
    quantidade: number;
    preco_unitario: number;
}
export default ItemPedido;
//# sourceMappingURL=Itempedido.d.ts.map