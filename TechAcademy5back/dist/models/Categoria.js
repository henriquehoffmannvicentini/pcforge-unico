"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Categoria extends sequelize_1.Model {
}
Categoria.init({
    id_categoria: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.default,
    tableName: "categoria",
    timestamps: false,
});
exports.default = Categoria;
//# sourceMappingURL=Categoria.js.map