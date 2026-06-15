"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Categoria_1 = __importDefault(require("./Categoria"));
class Produto extends sequelize_1.Model {
}
Produto.init({
    id_produto: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
    },
    descricao: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    valor: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    id_categoria: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    imagem: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    destaque: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    estoque: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.default,
    tableName: "produto",
    timestamps: false,
});
Produto.belongsTo(Categoria_1.default, {
    foreignKey: "id_categoria",
    as: "categoria",
});
exports.default = Produto;
//# sourceMappingURL=Produto.js.map