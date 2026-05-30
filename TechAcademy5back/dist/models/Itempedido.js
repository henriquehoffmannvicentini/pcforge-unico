"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Produto_1 = __importDefault(require("./Produto"));
class ItemPedido extends sequelize_1.Model {
}
ItemPedido.init({
    id_item: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_pedido: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "pedido",
            key: "id_pedido",
        },
    },
    id_produto: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "produto",
            key: "id_produto",
        },
    },
    quantidade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    preco_unitario: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
}, {
    sequelize: database_1.default,
    tableName: "item_pedido",
    timestamps: false,
});
ItemPedido.belongsTo(Produto_1.default, { foreignKey: "id_produto", as: "produto" });
Produto_1.default.hasMany(ItemPedido, { foreignKey: "id_produto", as: "itens_pedido" });
exports.default = ItemPedido;
//# sourceMappingURL=Itempedido.js.map