"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Cliente_1 = __importDefault(require("./Cliente"));
const Endereco_1 = __importDefault(require("./Endereco"));
const Itempedido_1 = __importDefault(require("./Itempedido"));
class Pedido extends sequelize_1.Model {
}
Pedido.init({
    id_pedido: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cliente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "cliente",
            key: "id_cliente",
        },
    },
    id_endereco_entrega: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "endereco",
            key: "id_endereco",
        },
    },
    data_pedido: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    metodo: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
    },
    valor: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "pendente",
    },
    data_pagamento: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: database_1.default,
    tableName: "pedido",
    timestamps: false,
});
Pedido.belongsTo(Cliente_1.default, { foreignKey: "id_cliente", as: "cliente" });
Cliente_1.default.hasMany(Pedido, { foreignKey: "id_cliente", as: "pedidos" });
Pedido.belongsTo(Endereco_1.default, { foreignKey: "id_endereco_entrega", as: "endereco_entrega" });
Pedido.hasMany(Itempedido_1.default, { foreignKey: "id_pedido", as: "itens" });
Itempedido_1.default.belongsTo(Pedido, { foreignKey: "id_pedido", as: "pedido" });
exports.default = Pedido;
//# sourceMappingURL=Pedido.js.map